# config/settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Paths
DATA_DIR = BASE_DIR / "data"
LOG_DIR = BASE_DIR / "logs"
SRC_DIR = BASE_DIR / "src"

# Database (local dev placeholder)
DB_HOST = os.getenv("ARGO_DB_HOST", "localhost")
DB_PORT = os.getenv("ARGO_DB_PORT", "5432")
DB_NAME = os.getenv("ARGO_DB_NAME", "argosea")
DB_USER = os.getenv("ARGO_DB_USER", "argosea")
DB_PASSWORD = os.getenv("ARGO_DB_PASSWORD", "changeme")

# External APIs (placeholders)
MARITIME_API_URL = os.getenv("ARGO_MARITIME_API_URL", "https://api.example.com/ais")
MARITIME_API_KEY = os.getenv("ARGO_MARITIME_API_KEY", "REPLACE_ME")

# Quantum
IBM_QUANTUM_TOKEN = os.getenv("ARGO_IBM_TOKEN", "REPLACE_ME")
IBM_QUANTUM_BACKEND = os.getenv("ARGO_IBM_BACKEND", "ibm_fez")
MAX_QUBITS = int(os.getenv("ARGO_MAX_QUBITS", "150"))

# Verification
SAFETY_DISTANCE_NM = float(os.getenv("ARGO_SAFETY_DISTANCE_NM", "5.0"))
VERIFICATION_TIMEOUT_S = int(os.getenv("ARGO_VERIFY_TIMEOUT", "300"))

# API
API_HOST = os.getenv("ARGO_API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("ARGO_API_PORT", "8000"))

if __name__ == "__main__":
    print("ArgoSea settings loaded:")
    for k, v in sorted(globals().items()):
        if k.isupper():
            print(f"  {k} = {v}")
