"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";

export default function LiveStatus() {
  const [state, setState] = useState({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/status/`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setState({ kind: "down" });
          return;
        }
        setState({ kind: "up", data });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "down" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return <p className="at-live-status is-wait">Checking live API…</p>;
  }
  if (state.kind === "down") {
    return <p className="at-live-status is-down">Live API unreachable — map and proofs still run in demo mode.</p>;
  }

  const d = state.data || {};
  return (
    <p className="at-live-status is-up">
      Live API {d.version || "online"}
      {" · "}
      {d.fleet_records ?? "—"} verified AIS records
      {" · "}
      {d.quantum_runs ?? "—"} QPU jobs on {d.qpu_backend || "IBM"}
    </p>
  );
}
