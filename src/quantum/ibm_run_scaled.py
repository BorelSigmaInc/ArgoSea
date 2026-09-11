# src/quantum/ibm_run_scaled.py
"""
Scale QAOA to 8 qubits: optimize locally, then submit to IBM QPU.
"""
import json
from datetime import datetime, timezone
import numpy as np
from scipy.optimize import minimize

from qiskit import transpile
from qiskit.circuit.library import QAOAAnsatz
from qiskit.quantum_info import SparsePauliOp
from qiskit_aer import AerSimulator
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2

from config.settings import DATA_DIR, IBM_QUANTUM_BACKEND, MAX_QUBITS

QUANTUM_DIR = DATA_DIR / "quantum"
QUANTUM_DIR.mkdir(parents=True, exist_ok=True)

N_QUBITS = 8
REPS = 1
SHOTS_SIM = 512
SHOTS_QPU = 1024


def build_cost_hamiltonian(n: int) -> SparsePauliOp:
    pauli_list = []
    for i in range(n - 1):
        label = ["I"] * n
        label[i] = "Z"
        label[i + 1] = "Z"
        pauli_list.append(("".join(reversed(label)), 1.0))
    return SparsePauliOp.from_list(pauli_list)


def build_qaoa(n: int, reps: int):
    cost = build_cost_hamiltonian(n)
    ansatz = QAOAAnsatz(cost_operator=cost, reps=reps)
    ansatz.measure_all()
    return ansatz


def energy_from_counts(counts: dict) -> float:
    total = sum(counts.values())
    e = 0.0
    for b, c in counts.items():
        penalty = sum(1 for i in range(len(b) - 1) if b[i] == b[i + 1])
        e += penalty * c
    return e / total if total else 0.0


def optimize_local(n: int, reps: int, maxiter: int = 30):
    circuit = build_qaoa(n, reps)
    sim = AerSimulator()
    history = []

    def objective(params):
        bound = circuit.assign_parameters(params)
        compiled = transpile(bound, sim)
        res = sim.run(compiled, shots=SHOTS_SIM).result()
        e = energy_from_counts(res.get_counts())
        history.append((list(params), e))
        return e

    x0 = [0.5, 0.5]
    print(f"Optimizing {n}-qubit QAOA locally (COBYLA, {maxiter} iters)...")
    res = minimize(objective, x0, method="COBYLA",
                   options={"maxiter": maxiter, "rhobeg": 0.3})
    print(f"Optimal params: gamma={res.x[0]:.4f}, beta={res.x[1]:.4f}, energy={res.fun:.4f}")
    return res.x


def optimality_ratio(counts: dict) -> float:
    total = sum(counts.values())
    good = sum(c for b, c in counts.items()
               if sum(1 for i in range(len(b) - 1) if b[i] == b[i + 1]) == 0)
    return good / total if total else 0.0


def submit_ibm(n: int, reps: int, params: list, shots: int):
    service = QiskitRuntimeService(channel="ibm_quantum_platform", name="qdit-ibm")
    backend = service.backend(IBM_QUANTUM_BACKEND)

    circuit = build_qaoa(n, reps).assign_parameters(params)
    isa = transpile(circuit, backend=backend, optimization_level=3)
    print(f"Backend: {backend.name} ({backend.num_qubits} qubits)")
    print(f"ISA depth: {isa.depth()}, gates: {isa.size()}")

    sampler = SamplerV2(mode=backend)
    sampler.options.default_shots = shots
    sampler.options.twirling.enable_measure = True
    sampler.options.dynamical_decoupling.enable = True

    job = sampler.run([isa])
    job_id = job.job_id()
    print(f"Submitted job: {job_id}")
    result = job.result()
    counts = result[0].data.meas.get_counts()
    ratio = optimality_ratio(counts)
    print(f"Optimality ratio: {ratio:.2%}")

    record = {
        "job_id": job_id,
        "backend": backend.name,
        "num_qubits": n,
        "reps": reps,
        "shots": shots,
        "params": params,
        "twirling_enable_measure": True,
        "dynamical_decoupling": True,
        "depth": isa.depth(),
        "gates": isa.size(),
        "counts": counts,
        "optimality_ratio": ratio,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    out = QUANTUM_DIR / f"ibm_run_scaled_{job_id}.json"
    out.write_text(json.dumps(record, indent=2))
    print(f"Saved: {out}")
    return record


if __name__ == "__main__":
    n = N_QUBITS
    if n > MAX_QUBITS:
        raise SystemExit(f"{n} qubits exceeds MAX_QUBITS={MAX_QUBITS}")

    best_params = optimize_local(n, REPS, maxiter=30)
    record = submit_ibm(n, REPS, list(best_params), SHOTS_QPU)

    print("\nTop 5 outcomes (8-qubit, mitigated):")
    for bitstring, count in sorted(record["counts"].items(), key=lambda x: -x[1])[:5]:
        penalty = sum(1 for i in range(len(bitstring) - 1) if bitstring[i] == bitstring[i + 1])
        print(f"  {bitstring}: {count}  (penalty={penalty})")
