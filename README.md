# ArgoSea

Provably correct maritime decision-making, quantum-verified.

The customer site is branded **Maersat**. The API and internal console remain **ArgoSea**.

## Overview

ArgoSea combines real maritime intelligence (AIS, vessel, port, weather) with formal verification (z3) and hybrid quantum-classical optimization (Qiskit + IBM Quantum) to deliver proof-backed decisions for high-stakes operations.

## Stack

- **CPU layer:** z3-solver, FastAPI, PostgreSQL client, pandas
- **GPU layer:** qiskit-aer simulation, CUDA-ready
- **QPU layer:** IBM Quantum (156-qubit backends), QAOA + error mitigation
- **Frontend:** Next.js 16 + React 19, deployed on Vercel
- **Backend:** FastAPI + uvicorn, containerized with Docker, deployed on Hetzner (`:8010` so it can share the host)

## Frontends

- **Customer:** `/`, `/platform`, `/marine-mis`, `/update` (Maer), articles, careers, contact
- **Marine Maer console:** `/marine-maer/sign-in`, `/marine-maer/api-doc`, `/marine-maer/partners`, `/marine-maer/user`
- **Internal:** `/internal` (API health, z3 proof, AIS table, QPU job history). `/quantum` redirects here. Not in public nav; `robots.txt` disallows it.

Demo Maersat IDs (password `Maer-Console-2026`): `partner@maersat.com`, `user@maersat.com`, `ops@maersat.com`.

## Endpoints

Public (customer-safe):

- `GET /health` — liveness (`status`, `service`, `version`)
- `GET /status` — counts + backend name, no QPU payloads
- `GET /fleet` — verified AIS sample

Internal:

- `GET /verify` — formal safety proof (z3)
- `GET /quantum/runs` — list all QPU runs
- `GET /quantum/latest` — latest raw QPU record
- `GET /quantum/latest/refined` — latest refined QPU record
- `GET /overview` — one payload for the internal console
- `GET /docs` — OpenAPI UI
- `POST /maer/login` · `GET /maer/me` · `GET /maer/catalog` · `GET /maer/flow`
- Partner: `GET /maer/partners/dashboard` · `POST /maer/partners/offerings`
- Customer: `GET /maer/user/workspace` · `POST /maer/user/estimates` · `POST /maer/user/orders`

## Local Development

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e .
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend (from `frontend/`):

```bash
npm install
npm run dev
```

The Next.js proxy at `/api/proxy/*` forwards to `UPSTREAM_API_URL` (default Hetzner `http://46.224.200.113:8010`). For a fully local stack, run the API on `:8000` and set `UPSTREAM_API_URL=http://127.0.0.1:8000`.

## Docker (Hetzner)

Keep published API port **8010**. Do not publish Postgres/Kafka; other projects already share that host.

```bash
docker compose up -d --build argosea-api argosea-web
```

`argosea-web` publishes Next.js on host **3010** (avoids Arkham on 3000). Public console hostname is **https://maer-marine.q-dit.com** on the existing q-dit.com Cloudflare Tunnel (`127.0.0.1:3010`). No sudo/nginx. Do not change other tunnel hostnames.
