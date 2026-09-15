"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, fmtPct, fmtWhen } from "../../lib/api";
import "./internal.css";

export default function InternalPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/overview/`)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        setData(body);
      })
      .catch((err) => setError(String(err.message || err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const status = data?.status || {};
  const verify = data?.verify || {};
  const fleet = Array.isArray(data?.fleet) ? data.fleet : [];
  const quantum = data?.quantum || {};
  const refined = quantum.latest_refined || null;
  const runs = Array.isArray(quantum.runs) ? quantum.runs : [];

  return (
    <main className="ops">
      <div className="ops-wrap">
        <nav className="ops-nav" aria-label="Internal">
          <Link href="/">Customer home</Link>
          <Link href="/marine-mis/">Customer map</Link>
          <Link href="/platform/">Platform</Link>
          <a href="https://github.com/BorelSigmaInc/ArgoSea" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>

        <p className="ops-kicker">Internal · not indexed</p>
        <h1>ArgoSea operations</h1>
        <p className="ops-lead">
          Live FastAPI + z3 proof + IBM QPU records. This console is for operators.
          Customers use Home, Marine, Platform, and Maer.
        </p>

        <div className="ops-actions">
          <button type="button" className="ops-btn" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error && <p className="ops-error">Could not load overview: {error}</p>}

        <section className="ops-grid" aria-label="Service status">
          <div className="ops-stat">
            <span>API</span>
            <strong>{status.status || (loading ? "…" : "—")}</strong>
          </div>
          <div className="ops-stat">
            <span>Version</span>
            <strong>{status.version || "—"}</strong>
          </div>
          <div className="ops-stat">
            <span>Database</span>
            <strong>{status.db || "—"}</strong>
          </div>
          <div className="ops-stat">
            <span>QPU backend</span>
            <strong>{status.qpu_backend || "—"}</strong>
          </div>
        </section>

        <section className="ops-panel">
          <h2>Safety proof (z3)</h2>
          {verify.proof ? (
            <>
              <p className="ops-proof">{verify.proof}</p>
              <p className="ops-muted">
                Fleet {verify.fleet_size ?? "—"} · threshold {verify.safety_threshold_nm ?? "—"} NM ·
                violations {Array.isArray(verify.violations) ? verify.violations.length : "—"}
              </p>
            </>
          ) : (
            <p className="ops-muted">{loading ? "Loading…" : "No proof payload yet."}</p>
          )}
        </section>

        <section className="ops-panel">
          <h2>Latest refined QPU run</h2>
          {refined ? (
            <>
              <p>
                <span className="ops-pill is-ok">{refined.job_id}</span>
                {" · "}
                {refined.backend} · {refined.num_qubits} qubits · {refined.shots} shots · depth {refined.depth}
              </p>
              <p className="ops-muted">
                Raw {fmtPct(refined.raw_optimality_ratio)} → refined {fmtPct(refined.refined_optimality_ratio)}
                {refined.refinement_improvement_pp != null
                  ? ` · +${Number(refined.refinement_improvement_pp).toFixed(2)} pp`
                  : ""}
              </p>
              <p className="ops-muted">{fmtWhen(refined.timestamp)}</p>
            </>
          ) : (
            <p className="ops-muted">{loading ? "Loading…" : "No refined run on disk."}</p>
          )}
        </section>

        <section className="ops-panel">
          <h2>Verified AIS fleet ({fleet.length})</h2>
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>MMSI</th>
                  <th>Lat</th>
                  <th>Lon</th>
                  <th>Speed kn</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {fleet.map((v) => (
                  <tr key={v.mmsi}>
                    <td>{v.mmsi}</td>
                    <td>{v.lat}</td>
                    <td>{v.lon}</td>
                    <td>{v.speed_kn}</td>
                    <td>{v.course_deg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ops-panel">
          <h2>QPU job history ({runs.length})</h2>
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Qubits</th>
                  <th>Shots</th>
                  <th>Optimality</th>
                  <th>Refined</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.file}>
                    <td>
                      <span className="ops-pill">{run.job_id || run.file}</span>
                    </td>
                    <td>{run.num_qubits ?? "—"}</td>
                    <td>{run.shots ?? "—"}</td>
                    <td>{fmtPct(run.optimality_ratio ?? run.raw_optimality_ratio)}</td>
                    <td>{fmtPct(run.refined_optimality_ratio)}</td>
                    <td>{fmtWhen(run.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="ops-foot">ArgoSea internal console · not linked from customer navigation</p>
      </div>
    </main>
  );
}
