# ArgoSea

Provably correct maritime decision-making, quantum-verified.

## Overview

ArgoSea combines real maritime intelligence (AIS, vessel, port, weather) with formal verification (z3) and hybrid quantum-classical optimization (Qiskit + IBM Quantum) to deliver proof-backed decisions for high-stakes operations.

## Stack

- **CPU layer:** z3-solver, FastAPI, PostgreSQL client, pandas
- **GPU layer:** qiskit-aer simulation, CUDA-ready
- **QPU layer:** IBM Quantum (156-qubit backends), QAOA + error mitigation
- **Frontend:** Next.js 16 + React 19, deployed on Vercel
- **Backend:** FastAPI + uvicorn, containerized with Docker, deployed on Hetzner

## Endpoints

- `GET /health` — service status
- `GET /fleet` — vessel fleet data
- `GET /verify` — formal safety proof (z3)
- `GET /quantum/runs` — list all QPU runs
- `GET /quantum/latest` — latest raw QPU record
- `GET /quantum/latest/refined` — latest refined QPU record

## Local Development

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install -e .
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
