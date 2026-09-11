# src/quantum/ibm_run.py
"""
Reusable IBM Quantum QAOA runner for ArgoSea.

Submits a small QAOA circuit to a real IBM QPU, saves job ID and counts
to data/quantum/, and prints the top outcomes.
"""
import json
from datetime import datetime, timezone
from pathlib import Path

from qiskit import transpile
from qiskit.circuit.library import QAOAAnsatz
from qiskit.quantum_info import SparsePauliOp
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2

from config.settings import DATA_DIR, IBM_QUANTUM_BACKEND, MAX_QUBITS

QUANTUM_DIR = DATA_DIR / "quantum"
QUANTUM_DIR.mkdir(parents=True, exist_ok=True)


def build_cost_hamiltonian(n_qubits: int) -> SparsePauliOp:
    pauli_list = []
    for i in range(n_qubits - 1):
        label = ["I"] * n_qubits
        label[i] = "Z"
        label[i + 1] = "Z"
        pauli_list.append(("".join(reversed(label)), 1.0))
    return SparsePauliOp.from_list(pauli_list)


def build_qaoa(n_qubits: int, reps: int, params: list):
    cost = build_cost_hamiltonian(n_qubits)
    ansatz = QAOAAnsatz(cost_operator=cost, reps=reps)
    ansatz.measure_all()
    return ansatz.assign_parameters(params)


def run_on_ibm(n_qubits: int = 4, reps: int = 1, shots: int = 1024,
               params: list = None, backend_name: str = None) -> dict:
    params = params or [1.14, 0.4839]
    backend_name = backend_name or IBM_QUANTUM_BACKEND

    service = QiskitRuntimeService(channel="ibm_quantum_platform", name="qdit-ibm")
    backend = service.backend(backend_name)

    circuit = build_qaoa(n_qubits, reps, params)
    isa = transpile(circuit, backend=backend, optimization_level=3)

    sampler = SamplerV2(mode=backend)
    job = sampler.run([isa], shots=shots)
    job_id = job.job_id()
    print(f"Submitted job {job_id} to {backend.name} ({backend.num_qubits} qubits)")
    print(f"Transpiled depth: {isa.depth()}, gates: {isa.size()}")

    result = job.result()
    counts = result[0].data.meas.get_counts()

    record = {
        "job_id": job_id,
        "backend": backend.name,
        "num_qubits": n_qubits,
        "reps": reps,
        "shots": shots,
        "params": params,
        "depth": isa.depth(),
        "gates": isa.size(),
        "counts": counts,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    out = QUANTUM_DIR / f"ibm_run_{job_id}.json"
    out.write_text(json.dumps(record, indent=2))
    print(f"Saved results to {out}")
    return record


if __name__ == "__main__":
    n = 4
    if n > MAX_QUBITS:
        raise SystemExit(f"Requested {n} qubits exceeds MAX_QUBITS={MAX_QUBITS}")

    record = run_on_ibm(n_qubits=n, reps=1, shots=1024, params=[1.14, 0.4839])

    print("\nTop 5 outcomes from real QPU:")
    for bitstring, count in sorted(record["counts"].items(), key=lambda x: -x[1])[:5]:
        penalty = sum(1 for i in range(len(bitstring) - 1) if bitstring[i] == bitstring[i + 1])
        print(f"  {bitstring}: {count}  (penalty={penalty})")
