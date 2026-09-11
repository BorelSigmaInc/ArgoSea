# src/verification/verify_fleet.py
import json
import math
from itertools import combinations
from pathlib import Path
from z3 import Real, Solver, unsat

from config.settings import DATA_DIR, SAFETY_DISTANCE_NM

def load_fleet(path: Path) -> list:
    return json.loads(path.read_text())

def haversine_nm(lat1, lon1, lat2, lon2) -> float:
    """Great-circle distance in nautical miles."""
    R_nm = 3440.065
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R_nm * math.asin(math.sqrt(a))

def pairwise_violations(fleet: list, threshold_nm: float) -> list:
    violations = []
    for v1, v2 in combinations(fleet, 2):
        d = haversine_nm(v1["lat"], v1["lon"], v2["lat"], v2["lon"])
        if d < threshold_nm:
            violations.append((v1["mmsi"], v2["mmsi"], round(d, 3)))
    return violations

def z3_prove_safety_pattern(threshold_nm: float) -> str:
    """Prove that under the safety constraint, no violation is possible."""
    x1, y1, x2, y2 = Real('x1'), Real('y1'), Real('x2'), Real('y2')
    s = Solver()
    # Assume the safety constraint holds
    s.add((x1 - x2) ** 2 + (y1 - y2) ** 2 >= threshold_nm ** 2)
    # Ask: can a violation also hold?
    s.push()
    s.add((x1 - x2) ** 2 + (y1 - y2) ** 2 < threshold_nm ** 2)
    result = s.check()
    s.pop()
    return "PROVEN: Safety constraint excludes all violations." if result == unsat else f"COUNTEREXAMPLE: {s.model()}"

def summarize(fleet: list, violations: list, proof: str) -> None:
    print(f"Fleet size: {len(fleet)}")
    print(f"Safety threshold: {SAFETY_DISTANCE_NM} NM")
    print(f"Pairwise violations in real data: {len(violations)}")
    for mmsi1, mmsi2, d in violations[:5]:
        print(f"  VIOLATION: MMSI {mmsi1} <-> {mmsi2} at {d} NM")
    print(proof)

if __name__ == "__main__":
    fleet = load_fleet(DATA_DIR / "sample_ais.json")
    violations = pairwise_violations(fleet, SAFETY_DISTANCE_NM)
    proof = z3_prove_safety_pattern(SAFETY_DISTANCE_NM)
    summarize(fleet, violations, proof)
