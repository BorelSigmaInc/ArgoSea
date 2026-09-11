# src/api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
import json

from config.settings import DATA_DIR, SAFETY_DISTANCE_NM
from src.verification.verify_fleet import (
    load_fleet, pairwise_violations, z3_prove_safety_pattern
)

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="ArgoSea API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUANTUM_DIR = DATA_DIR / "quantum"


class VerifyResponse(BaseModel):
    fleet_size: int
    safety_threshold_nm: float
    violations: list
    proof: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "argosea", "version": "0.3.0"}


@app.get("/fleet")
def fleet():
    path = DATA_DIR / "sample_ais.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="No fleet data found.")
    return load_fleet(path)


@app.get("/verify", response_model=VerifyResponse)
def verify():
    path = DATA_DIR / "sample_ais.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail="No fleet data found.")
    fleet_data = load_fleet(path)
    violations = pairwise_violations(fleet_data, SAFETY_DISTANCE_NM)
    proof = z3_prove_safety_pattern(SAFETY_DISTANCE_NM)
    return VerifyResponse(
        fleet_size=len(fleet_data),
        safety_threshold_nm=SAFETY_DISTANCE_NM,
        violations=[{"mmsi_1": a, "mmsi_2": b, "distance_nm": d} for a, b, d in violations],
        proof=proof,
    )


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


@app.get("/quantum/runs")
def quantum_runs():
    if not QUANTUM_DIR.exists():
        return {"count": 0, "runs": []}
    files = sorted(QUANTUM_DIR.glob("ibm_run_*.json"))
    runs = []
    for f in files:
        try:
            data = json.loads(f.read_text())
            runs.append({"file": f.name, **_summarize_record(data)})
        except Exception:
            continue
    return {"count": len(runs), "runs": runs}


@app.get("/quantum/latest")
def quantum_latest():
    files = sorted(QUANTUM_DIR.glob("ibm_run_*.json"))
    files = [f for f in files if "_refined" not in f.name]
    if not files:
        raise HTTPException(status_code=404, detail="No quantum runs found.")
    return json.loads(files[-1].read_text())


@app.get("/quantum/latest/refined")
def quantum_latest_refined():
    files = sorted(QUANTUM_DIR.glob("*_refined.json"))
    if not files:
        raise HTTPException(status_code=404, detail="No refined quantum records found.")
    data = json.loads(files[-1].read_text())
    return {
        **_summarize_record(data),
        "source_file": data.get("source_file"),
        "counts": data.get("counts"),
        "refined_counts": data.get("refined_counts"),
    }
