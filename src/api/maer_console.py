# src/api/maer_console.py
"""Marine Maer console: auth, catalog, partner ops, customer estimates."""
from __future__ import annotations

import hashlib
import json
import secrets
import threading
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from config.settings import DATA_DIR

router = APIRouter(prefix="/maer", tags=["marine-maer"])
STORE_PATH = DATA_DIR / "maer" / "store.json"
_LOCK = threading.Lock()
_SALT = "maersat-maer-v1"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _hash_pw(password: str) -> str:
    return hashlib.sha256(f"{_SALT}:{password}".encode()).hexdigest()


def _seed() -> dict:
    pw = _hash_pw("Maer-Console-2026")
    return {
        "users": [
            {
                "id": "u-partner",
                "email": "partner@maersat.com",
                "name": "North Sea Partners",
                "role": "vendor",
                "org": "Maer Certified Vendor",
                "password_hash": pw,
            },
            {
                "id": "u-user",
                "email": "user@maersat.com",
                "name": "Harbour Operations",
                "role": "customer",
                "org": "Blue Channel Lines",
                "password_hash": pw,
            },
            {
                "id": "u-ops",
                "email": "ops@maersat.com",
                "name": "Maersat Operator",
                "role": "operator",
                "org": "Maersat Technologies Inc.",
                "password_hash": pw,
            },
        ],
        "sessions": [],
        "vendors": [
            {
                "id": "v-northsea",
                "name": "North Sea Partners",
                "owner_id": "u-partner",
                "region": "north-sea",
                "rating": 4.8,
                "on_call": True,
                "customers": 14,
            },
            {
                "id": "v-med",
                "name": "MedTrack Marine",
                "owner_id": "u-ops",
                "region": "mediterranean",
                "rating": 4.6,
                "on_call": True,
                "customers": 9,
            },
        ],
        "offerings": [
            {
                "id": "off-ais",
                "vendor_id": "v-northsea",
                "name": "maer-ais-live",
                "plan": "maer",
                "region": "north-sea",
                "vessels": 40,
                "api_calls_k": 10,
                "qpu_jobs": 1,
                "monthly_usd": 299,
                "status": "active",
            },
            {
                "id": "off-pro",
                "vendor_id": "v-northsea",
                "name": "maer-verify-pro",
                "plan": "maer-pro",
                "region": "north-sea",
                "vessels": 120,
                "api_calls_k": 100,
                "qpu_jobs": 20,
                "monthly_usd": 449,
                "status": "active",
            },
        ],
        "catalog": [
            {
                "id": "cat-ais",
                "name": "Marine MIS live tracking",
                "sku": "AIS-LIVE",
                "unit": "mo",
                "price": 299,
                "blurb": "Satellite-aware AIS picture, search, and verified overlay.",
            },
            {
                "id": "cat-z3",
                "name": "Formal safety verification",
                "sku": "Z3-PROOF",
                "unit": "mo",
                "price": 449,
                "blurb": "z3 safety proofs and route certificates.",
            },
            {
                "id": "cat-qpu",
                "name": "QPU-verified routing",
                "sku": "QAOA-QPU",
                "unit": "mo",
                "price": 499,
                "blurb": "IBM Quantum QAOA jobs with refined optimality.",
            },
            {
                "id": "cat-oncall",
                "name": "24/7 vendor on-call",
                "sku": "ONCALL",
                "unit": "mo",
                "price": 180,
                "blurb": "Named engineer with 30-minute maritime SLA.",
            },
        ],
        "orders": [
            {
                "id": "ord-1001",
                "customer_id": "u-user",
                "vendor_id": "v-northsea",
                "sku": "AIS-LIVE",
                "title": "Marine MIS live tracking",
                "monthly_usd": 299,
                "status": "in-service",
                "region": "north-sea",
                "map_href": "/marine-mis/centerx:27.8/centery:44.0/zoom:3/",
                "opened": "2026-09-11T08:00:00+00:00",
                "updated": "2026-09-15T05:00:00+00:00",
            }
        ],
        "tickets": [
            {
                "id": "tck-88",
                "vendor_id": "v-northsea",
                "customer_id": "u-user",
                "severity": "sev-2",
                "title": "AIS drop near Bosporus corridor",
                "status": "on-call",
                "opened": "2026-09-15T04:10:00+00:00",
                "sla_minutes": 30,
            }
        ],
        "estimates": [],
        "events": [
            {
                "id": "evt-1",
                "order_id": "ord-1001",
                "at": "2026-09-11T08:00:00+00:00",
                "label": "Order accepted",
            },
            {
                "id": "evt-2",
                "order_id": "ord-1001",
                "at": "2026-09-11T09:20:00+00:00",
                "label": "Coverage attached to Marine MIS viewport 27.8E 44.0N",
            },
        ],
        "sales": [
            {"id": "sale-1", "vendor_id": "v-northsea", "month": "2026-09", "usd": 748, "seats": 2},
            {"id": "sale-2", "vendor_id": "v-northsea", "month": "2026-08", "usd": 598, "seats": 2},
        ],
    }


def _load() -> dict:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not STORE_PATH.exists():
        data = _seed()
        STORE_PATH.write_text(json.dumps(data, indent=2))
        return data
    return json.loads(STORE_PATH.read_text())


def _save(data: dict) -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = STORE_PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, indent=2))
    tmp.replace(STORE_PATH)


def _public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "org": user["org"],
        "home": _home_for(user["role"]),
    }


def _home_for(role: str) -> str:
    if role == "vendor":
        return "/marine-maer/partners/"
    if role == "customer":
        return "/marine-maer/user/"
    return "/marine-maer/api-doc/"


def _user_from_auth(authorization: str | None) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Sign in required.")
    token = authorization.split(" ", 1)[1].strip()
    with _LOCK:
        data = _load()
        session = next((s for s in data["sessions"] if s["token"] == token), None)
        if not session:
            raise HTTPException(status_code=401, detail="Session expired.")
        exp = datetime.fromisoformat(session["expires"])
        if exp < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Session expired.")
        user = next((u for u in data["users"] if u["id"] == session["user_id"]), None)
        if not user:
            raise HTTPException(status_code=401, detail="Unknown user.")
        return user


class LoginBody(BaseModel):
    email: str
    password: str = ""


class OfferingBody(BaseModel):
    name: str
    plan: str = "maer"
    region: str = "north-sea"
    vessels: int = 40
    api_calls_k: int = 10
    qpu_jobs: int = 1


class StatusBody(BaseModel):
    status: str


class EstimateBody(BaseModel):
    items: list[str] = Field(default_factory=list)
    region: str = "north-sea"
    vendor_id: str = "v-northsea"


class OrderBody(BaseModel):
    estimate_id: str | None = None
    sku: str = "AIS-LIVE"
    vendor_id: str = "v-northsea"
    region: str = "north-sea"


PLAN_PRICE = {"maer": 299, "maer-pro": 449, "maer-pro-plus": 499}


def _quote(plan: str, vessels: int, api_calls_k: int, qpu_jobs: int) -> int:
    base = PLAN_PRICE.get(plan, 299)
    extra = max(0, vessels - 10) * 2 + max(0, api_calls_k - 10) * 1 + max(0, qpu_jobs - 1) * 12
    return int(base + extra)


@router.post("/login")
def login(body: LoginBody):
    email = body.email.strip().lower()
    with _LOCK:
        data = _load()
        user = next((u for u in data["users"] if u["email"] == email), None)
        if not user:
            raise HTTPException(status_code=401, detail="Maersat ID not found.")
        if body.password and user["password_hash"] != _hash_pw(body.password):
            raise HTTPException(status_code=401, detail="Incorrect password.")
        if not body.password:
            return {"step": "password", "email": user["email"], "name": user["name"]}
        token = secrets.token_urlsafe(32)
        data["sessions"] = [s for s in data["sessions"] if s["user_id"] != user["id"]]
        data["sessions"].append(
            {
                "token": token,
                "user_id": user["id"],
                "expires": (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat(),
            }
        )
        _save(data)
        return {"token": token, "user": _public_user(user)}


@router.post("/logout")
def logout(authorization: str | None = Header(default=None)):
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        with _LOCK:
            data = _load()
            data["sessions"] = [s for s in data["sessions"] if s["token"] != token]
            _save(data)
    return {"ok": True}


@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    return {"user": _public_user(_user_from_auth(authorization))}


@router.get("/catalog")
def catalog():
    with _LOCK:
        data = _load()
        return {
            "catalog": data["catalog"],
            "regions": [
                {"id": "north-sea", "label": "North Sea / EU-GB"},
                {"id": "mediterranean", "label": "Mediterranean / EU-DE"},
                {"id": "singapore", "label": "Singapore / AP-SEA"},
                {"id": "gulf", "label": "Gulf / US-South analog"},
            ],
            "plans": [
                {"id": "maer", "name": "Maer", "price": 299},
                {"id": "maer-pro", "name": "Maer Pro", "price": 449},
                {"id": "maer-pro-plus", "name": "Maer Pro+", "price": 499},
            ],
        }


@router.get("/flow")
def flow():
    """Client-review process map tying Marine MIS to Maer console."""
    return {
        "title": "Marine Maer operating picture",
        "business": [
            "Customer estimates coverage on /marine-maer/user and places an order.",
            "Certified vendor accepts on /marine-maer/partners, assigns on-call, and tracks sales.",
            "Live picture is the Marine MIS map (center/zoom URL is the shareable operating view).",
            "Proof jobs (z3 + QPU) stay on the ArgoSea API and internal console.",
        ],
        "program": [
            "Next.js app routes under /marine-maer/* (IBM-style Carbon chrome, Maersat brand).",
            "FastAPI /maer/* persists orders, tickets, estimates in data/maer/store.json.",
            "Vercel / Cloudflare (marine.maersat.com) proxy /api/proxy/* to Hetzner :8010.",
            "Marine MIS: generateFleet + /fleet overlay + URL state centerx/centery/zoom.",
        ],
        "map": "/marine-mis/centerx:27.8/centery:44.0/zoom:3/",
    }


@router.get("/partners/dashboard")
def partner_dashboard(authorization: str | None = Header(default=None)):
    user = _user_from_auth(authorization)
    if user["role"] not in {"vendor", "operator"}:
        raise HTTPException(status_code=403, detail="Vendor access only.")
    with _LOCK:
        data = _load()
        vendor = next((v for v in data["vendors"] if v["owner_id"] == user["id"]), data["vendors"][0])
        vid = vendor["id"]
        offerings = [o for o in data["offerings"] if o["vendor_id"] == vid]
        orders = [o for o in data["orders"] if o["vendor_id"] == vid]
        tickets = [t for t in data["tickets"] if t["vendor_id"] == vid]
        sales = [s for s in data["sales"] if s["vendor_id"] == vid]
        return {
            "vendor": vendor,
            "offerings": offerings,
            "orders": orders,
            "tickets": tickets,
            "sales": sales,
            "kpis": {
                "mrr": sum(o["monthly_usd"] for o in orders if o["status"] in {"in-service", "accepted"}),
                "open_tickets": len([t for t in tickets if t["status"] != "resolved"]),
                "active_services": len([o for o in offerings if o["status"] == "active"]),
            },
        }


@router.post("/partners/offerings")
def create_offering(body: OfferingBody, authorization: str | None = Header(default=None)):
    user = _user_from_auth(authorization)
    if user["role"] not in {"vendor", "operator"}:
        raise HTTPException(status_code=403, detail="Vendor access only.")
    monthly = _quote(body.plan, body.vessels, body.api_calls_k, body.qpu_jobs)
    with _LOCK:
        data = _load()
        vendor = next((v for v in data["vendors"] if v["owner_id"] == user["id"]), data["vendors"][0])
        item = {
            "id": f"off-{secrets.token_hex(3)}",
            "vendor_id": vendor["id"],
            "name": body.name.strip() or "maer-service",
            "plan": body.plan,
            "region": body.region,
            "vessels": body.vessels,
            "api_calls_k": body.api_calls_k,
            "qpu_jobs": body.qpu_jobs,
            "monthly_usd": monthly,
            "status": "active",
            "created": _now(),
        }
        data["offerings"].append(item)
        _save(data)
        return item


@router.post("/partners/tickets/{ticket_id}")
def ticket_status(ticket_id: str, body: StatusBody, authorization: str | None = Header(default=None)):
    _user_from_auth(authorization)
    with _LOCK:
        data = _load()
        ticket = next((t for t in data["tickets"] if t["id"] == ticket_id), None)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found.")
        ticket["status"] = body.status
        ticket["updated"] = _now()
        _save(data)
        return ticket


@router.post("/partners/orders/{order_id}")
def order_status(order_id: str, body: StatusBody, authorization: str | None = Header(default=None)):
    _user_from_auth(authorization)
    with _LOCK:
        data = _load()
        order = next((o for o in data["orders"] if o["id"] == order_id), None)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found.")
        order["status"] = body.status
        order["updated"] = _now()
        data["events"].append(
            {
                "id": f"evt-{secrets.token_hex(3)}",
                "order_id": order_id,
                "at": _now(),
                "label": f"Status → {body.status}",
            }
        )
        _save(data)
        return order


@router.get("/user/workspace")
def user_workspace(authorization: str | None = Header(default=None)):
    user = _user_from_auth(authorization)
    with _LOCK:
        data = _load()
        orders = [o for o in data["orders"] if o["customer_id"] == user["id"]]
        estimates = [e for e in data["estimates"] if e["customer_id"] == user["id"]]
        events = [e for e in data["events"] if e["order_id"] in {o["id"] for o in orders}]
        return {
            "user": _public_user(user),
            "orders": orders,
            "estimates": estimates,
            "events": sorted(events, key=lambda e: e["at"]),
            "vendors": data["vendors"],
            "catalog": data["catalog"],
        }


@router.post("/user/estimates")
def create_estimate(body: EstimateBody, authorization: str | None = Header(default=None)):
    user = _user_from_auth(authorization)
    with _LOCK:
        data = _load()
        items = [c for c in data["catalog"] if c["id"] in body.items]
        monthly = sum(i["price"] for i in items)
        est = {
            "id": f"est-{secrets.token_hex(3)}",
            "customer_id": user["id"],
            "vendor_id": body.vendor_id,
            "region": body.region,
            "items": items,
            "monthly_usd": monthly,
            "created": _now(),
        }
        data["estimates"].append(est)
        _save(data)
        return est


@router.post("/user/orders")
def create_order(body: OrderBody, authorization: str | None = Header(default=None)):
    user = _user_from_auth(authorization)
    with _LOCK:
        data = _load()
        catalog_item = next((c for c in data["catalog"] if c["sku"] == body.sku), data["catalog"][0])
        monthly = catalog_item["price"]
        if body.estimate_id:
            est = next((e for e in data["estimates"] if e["id"] == body.estimate_id), None)
            if est:
                monthly = est["monthly_usd"]
                catalog_item = {"name": "Estimate bundle", "sku": "BUNDLE", **catalog_item}
        order = {
            "id": f"ord-{secrets.token_hex(3)}",
            "customer_id": user["id"],
            "vendor_id": body.vendor_id,
            "sku": catalog_item["sku"],
            "title": catalog_item["name"],
            "monthly_usd": monthly,
            "status": "pending",
            "region": body.region,
            "map_href": "/marine-mis/centerx:27.8/centery:44.0/zoom:3/",
            "opened": _now(),
            "updated": _now(),
        }
        data["orders"].append(order)
        data["events"].append(
            {
                "id": f"evt-{secrets.token_hex(3)}",
                "order_id": order["id"],
                "at": _now(),
                "label": "Customer submitted service request",
            }
        )
        _save(data)
        return order
