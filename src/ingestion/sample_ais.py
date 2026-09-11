# src/ingestion/sample_ais.py
import json
import random
from datetime import datetime, timezone
from pathlib import Path
from config.settings import DATA_DIR, SAFETY_DISTANCE_NM

def generate_vessel(vessel_id: int) -> dict:
    return {
        "mmsi": 200000000 + vessel_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "lat": round(random.uniform(-90, 90), 4),
        "lon": round(random.uniform(-180, 180), 4),
        "speed_kn": round(random.uniform(0, 25), 2),
        "course_deg": round(random.uniform(0, 360), 1),
    }

def generate_fleet(n: int = 10) -> list:
    return [generate_vessel(i) for i in range(n)]

def save_fleet(fleet: list, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(fleet, indent=2))
    print(f"Saved {len(fleet)} vessels to {path}")

def load_fleet(path: Path) -> list:
    return json.loads(path.read_text())

def summarize(fleet: list) -> None:
    speeds = [v["speed_kn"] for v in fleet]
    print(f"Fleet size: {len(fleet)}")
    print(f"Avg speed: {sum(speeds)/len(speeds):.2f} kn")
    print(f"Max speed: {max(speeds):.2f} kn")
    print(f"Safety distance threshold: {SAFETY_DISTANCE_NM} NM")

if __name__ == "__main__":
    out_path = DATA_DIR / "sample_ais.json"
    fleet = generate_fleet(10)
    save_fleet(fleet, out_path)
    loaded = load_fleet(out_path)
    summarize(loaded)
