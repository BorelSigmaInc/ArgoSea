"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API = "/api/proxy";

export default function QuantumPage() {
  const [health, setHealth] = useState(null);
  const [refined, setRefined] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/health`).then((r) => r.json()).then(setHealth).catch((e) => setError(String(e)));
    fetch(`${API}/quantum/latest/refined`)
      .then((r) => r.json())
      .then(setRefined)
      .catch((e) => setError(String(e)));
  }, []);

  const fmtPct = (x) => (x == null ? "—" : `${(x * 100).toFixed(2)}%`);

  return (
    <main style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto", background: "#0b0f14", minHeight: "100vh", color: "#e6edf3" }}>
      <p><Link href="/en/ais/home/centerx:13.2/centery:13.8/zoom:3" style={{ color: "#79c0ff" }}>← Live Map</Link></p>
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>Maersat</h1>
      <p style={{ color: "#7d8590", marginTop: 0 }}>Provably correct maritime decisions, quantum-verified.</p>

      <section style={{ marginTop: 32, padding: 20, background: "#111820", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>API Health</h2>
        {health ? (
          <pre style={{ color: "#7ee787", margin: 0 }}>{JSON.stringify(health, null, 2)}</pre>
        ) : error ? (
          <p style={{ color: "#f85149" }}>Error: {error}</p>
        ) : <p>Loading…</p>}
      </section>

      <section style={{ marginTop: 20, padding: 20, background: "#111820", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Latest Quantum Run (Refined)</h2>
        {refined ? (
          <>
            <p style={{ margin: "4px 0" }}><b>Job:</b> {refined.job_id}</p>
            <p style={{ margin: "4px 0" }}><b>Backend:</b> {refined.backend} · <b>Qubits:</b> {refined.num_qubits} · <b>Shots:</b> {refined.shots} · <b>Depth:</b> {refined.depth}</p>
            <p style={{ margin: "4px 0", color: "#7d8590" }}>Raw optimality: <b style={{ color: "#79c0ff" }}>{fmtPct(refined.raw_optimality_ratio)}</b></p>
            <p style={{ margin: "4px 0", color: "#7d8590" }}>Refined optimality: <b style={{ color: "#7ee787" }}>{fmtPct(refined.refined_optimality_ratio)}</b></p>
            <p style={{ margin: "4px 0", color: "#7d8590" }}>Improvement: <b style={{ color: "#f0883e" }}>+{refined.refinement_improvement_pp?.toFixed(2)} pp</b></p>
          </>
        ) : <p>Loading…</p>}
      </section>

      <p style={{ marginTop: 40, fontSize: 12, color: "#484f58" }}>© 2026 Maersat · info@maersat.com</p>
    </main>
  );
}
