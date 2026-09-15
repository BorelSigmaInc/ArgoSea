# src/api/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import json

from config.settings import (
    DATA_DIR,
    SAFETY_DISTANCE_NM,
    IBM_QUANTUM_BACKEND,
    API_VERSION,
    cors_origins,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
)
from src.verification.verify_fleet import (
    load_fleet, pairwise_violations, z3_prove_safety_pattern
)
from src.api.maer_console import router as maer_router

app = FastAPI(
    title="ArgoSea API",
    version=API_VERSION,
    description=(
        "Public maritime endpoints for fleet health and a separate internal "
        "overview for QPU runs and z3 safety proofs. Existing paths are unchanged."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "HEAD", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(maer_router)

QUANTUM_DIR = DATA_DIR / "quantum"
FLEET_PATH = DATA_DIR / "sample_ais.json"


class VerifyResponse(BaseModel):
    fleet_size: int
    safety_threshold_nm: float
    violations: list
    proof: str


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class StatusResponse(BaseModel):
    status: str
    service: str
    version: str
    audience: str = "public"
    fleet_records: int = 0
    quantum_runs: int = 0
    refined_runs: int = 0
    db: str = "unchecked"
    qpu_backend: str = Field(default="")


def _load_fleet_or_404() -> list:
    if not FLEET_PATH.exists():
        raise HTTPException(status_code=404, detail="No fleet data found.")
    return load_fleet(FLEET_PATH)


def _summarize_record(data: dict) -> dict:
    return {
        "job_id": data.get("job_id"),
        "backend": data.get("backend"),
        "num_qubits": data.get("num_qubits"),
        "shots": data.get("shots"),
        "depth": data.get("depth"),
        "optimality_ratio": data.get("optimality_ratio"),
        "raw_optimality_ratio": data.get("raw_optimality_ratio"),
        "refined_optimality_ratio": data.get("refined_optimality_ratio"),
        "refinement_improvement_pp": data.get("refinement_improvement_pp"),
        "timestamp": data.get("timestamp"),
    }


def _list_run_files() -> list[Path]:
    if not QUANTUM_DIR.exists():
        return []
    return sorted(QUANTUM_DIR.glob("ibm_run_*.json"))


def _quantum_inventory() -> dict:
    files = _list_run_files()
    refined = [f for f in files if f.name.endswith("_refined.json")]
    raw = [f for f in files if "_refined" not in f.name]
    return {"files": files, "raw": raw, "refined": refined}


def _db_status() -> str:
    try:
        import psycopg2
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            connect_timeout=2,
        )
        conn.close()
        return "up"
    except Exception:
        return "unreachable"


def _verify_payload(fleet_data: list) -> dict:
    violations = pairwise_violations(fleet_data, SAFETY_DISTANCE_NM)
    proof = z3_prove_safety_pattern(SAFETY_DISTANCE_NM)
    return {
        "fleet_size": len(fleet_data),
        "safety_threshold_nm": SAFETY_DISTANCE_NM,
        "violations": [
            {"mmsi_1": a, "mmsi_2": b, "distance_nm": d} for a, b, d in violations
        ],
        "proof": proof,
    }


@app.get("/health", response_model=HealthResponse, tags=["public"])
def health():
    """Liveness probe used by Docker, Vercel proxy, and the customer status chip."""
    return {"status": "ok", "service": "argosea", "version": API_VERSION}


@app.get("/status", response_model=StatusResponse, tags=["public"])
def status():
    """Read-only service summary. Safe for the customer UI; no QPU payloads."""
    inventory = _quantum_inventory()
    fleet_n = 0
    if FLEET_PATH.exists():
        try:
            fleet_n = len(load_fleet(FLEET_PATH))
        except Exception:
            fleet_n = 0
    return {
        "status": "ok",
        "service": "argosea",
        "version": API_VERSION,
        "audience": "public",
        "fleet_records": fleet_n,
        "quantum_runs": len(inventory["raw"]),
        "refined_runs": len(inventory["refined"]),
        "db": _db_status(),
        "qpu_backend": IBM_QUANTUM_BACKEND,
    }


@app.get("/fleet", tags=["public"])
def fleet():
    return _load_fleet_or_404()


@app.get("/verify", response_model=VerifyResponse, tags=["internal"])
def verify():
    return _verify_payload(_load_fleet_or_404())


@app.get("/quantum/runs", tags=["internal"])
def quantum_runs():
    inventory = _quantum_inventory()
    runs = []
    for f in inventory["files"]:
        try:
            data = json.loads(f.read_text())
            runs.append({"file": f.name, **_summarize_record(data)})
        except Exception:
            continue
    return {"count": len(runs), "runs": runs}


@app.get("/quantum/latest", tags=["internal"])
def quantum_latest():
    inventory = _quantum_inventory()
    if not inventory["raw"]:
        raise HTTPException(status_code=404, detail="No quantum runs found.")
    return json.loads(inventory["raw"][-1].read_text())


@app.get("/quantum/latest/refined", tags=["internal"])
def quantum_latest_refined():
    inventory = _quantum_inventory()
    if not inventory["refined"]:
        raise HTTPException(status_code=404, detail="No refined quantum records found.")
    data = json.loads(inventory["refined"][-1].read_text())
    return {
        **_summarize_record(data),
        "source_file": data.get("source_file"),
        "counts": data.get("counts"),
        "refined_counts": data.get("refined_counts"),
    }


@app.get("/overview", tags=["internal"])
def overview():
    """Single payload for the internal operations console."""
    fleet_data = _load_fleet_or_404()
    inventory = _quantum_inventory()
    runs = []
    for f in inventory["files"]:
        try:
            data = json.loads(f.read_text())
            runs.append({"file": f.name, **_summarize_record(data)})
        except Exception:
            continue
    latest_refined = None
    if inventory["refined"]:
        data = json.loads(inventory["refined"][-1].read_text())
        latest_refined = {
            **_summarize_record(data),
            "source_file": data.get("source_file"),
        }
    return {
        "status": {
            "status": "ok",
            "service": "argosea",
            "version": API_VERSION,
            "db": _db_status(),
            "qpu_backend": IBM_QUANTUM_BACKEND,
        },
        "verify": _verify_payload(fleet_data),
        "fleet": fleet_data,
        "quantum": {
            "count": len(runs),
            "runs": runs,
            "latest_refined": latest_refined,
        },
    }
