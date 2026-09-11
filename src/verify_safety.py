# src/verify_safety.py
from z3 import *

# Two vessels with positions and safety distance
v1_x, v1_y = Real('v1_x'), Real('v1_y')
v2_x, v2_y = Real('v2_x'), Real('v2_y')
safety_dist = 5.0

s = Solver()
# Assume vessels are at least safety_dist apart
s.add((v1_x - v2_x)**2 + (v1_y - v2_y)**2 >= safety_dist**2)

# Check if there exists a violation (distance < safety_dist)
s.push()
s.add((v1_x - v2_x)**2 + (v1_y - v2_y)**2 < safety_dist**2)
result = s.check()
s.pop()

if result == unsat:
    print("PROOF: No violation possible. Safety constraint holds for all positions.")
else:
    print("COUNTEREXAMPLE: Violation possible at:", s.model())

# Demonstrate a simple quantum circuit (optional)
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0,1], [0,1])
sim = AerSimulator()
compiled = transpile(qc, sim)
result = sim.run(compiled, shots=100).result()
counts = result.get_counts()
print("Quantum circuit result (Bell state):", counts)
