# src/quantum/ibm_submit.py
"""
Bridge from local qiskit-aer simulation to IBM Quantum hardware.

This script:
  1. Reads IBM Quantum credentials from config.
  2. Lists available backends.
  3. Prepares the QAOA circuit for submission.
  4. Does NOT submit unless ARGO_IBM_SUBMIT=1.
"""
import os
from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import QAOAAnsatz
from qiskit.quantum_info import SparsePauliOp

from config.settings import IBM_QUANTUM_TOKEN, IBM_QUANTUM_BACKEND, MAX_QUBITS

def build_cost_hamiltonian(n_qubits: int = 4) -> SparsePauliOp:
    pauli_list = []
    for i in range(n_qubits - 1):
        label = ["I"] * n_qubits
        label[i] = "Z"
        label[i + 1] = "Z"
        pauli_list.append(("".join(reversed(label)), 1.0))
    return SparsePauliOp.from_list(pauli_list)

def build_qaoa_circuit(n_qubits: int = 4, reps: int = 1) -> QuantumCircuit:
    cost = build_cost_hamiltonian(n_qubits)
    ansatz = QAOAAnsatz(cost_operator=cost, reps=reps)
    ansatz.measure_all()
    return ansatz

def main():
    print("=== IBM Quantum Submission Bridge ===")
    print(f"Configured backend: {IBM_QUANTUM_BACKEND}")
    print(f"Max qubits allowed: {MAX_QUBITS}")

    token = IBM_QUANTUM_TOKEN
    if token == "REPLACE_ME" or not token:
        print("\n[!] IBM_QUANTUM_TOKEN is not set.")
        print("    Set ARGO_IBM_TOKEN in your environment before submitting.")
        print("    Simulation-only mode remains available via qaoa_optimizer.py.")
    else:
        print("\n[+] Token detected (hidden). Ready to connect.")

    n = 4
    reps = 1
    circuit = build_qaoa_circuit(n, reps=reps)
    print(f"\nQAOA circuit: {n} qubits, reps {reps}, depth {circuit.depth()}, gates {circuit.size()}")
    print(f"Qubits required: {n} (within {MAX_QUBITS} limit: {n <= MAX_QUBITS})")

    # Optimal params from local optimizer
    optimal_params = [1.1400, 0.4839]
    bound = circuit.assign_parameters(optimal_params)
    print(f"Bound optimal parameters: gamma={optimal_params[0]}, beta={optimal_params[1]}")

    if os.getenv("ARGO_IBM_SUBMIT") == "1" and token != "REPLACE_ME":
        print("\n[+] ARGO_IBM_SUBMIT=1 detected. Would submit to IBM Quantum now.")
        print("    (Actual submission is disabled in this teaching step.)")
    else:
        print("\n[i] Dry run only. Set ARGO_IBM_SUBMIT=1 and ARGO_IBM_TOKEN to submit for real.")

    print("\nNext: scale to 150 qubits, add error mitigation, and submit via qiskit-ibm-runtime.")

if __name__ == "__main__":
    main()
