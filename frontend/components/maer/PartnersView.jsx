"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CloudShell from "./CloudShell";
import { maerFetch, money, readSession } from "../../lib/maer/session";

const PLAN_PRICE = { maer: 299, "maer-pro": 449, "maer-pro-plus": 499 };

export default function PartnersView() {
  const router = useRouter();
  const session = useMemo(() => readSession(), []);
  const [tab, setTab] = useState("catalog");
  const [dash, setDash] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "maer-ais-prod",
    plan: "maer-pro",
    region: "north-sea",
    vessels: 80,
    api_calls_k: 100,
    qpu_jobs: 20,
  });
  const quote = PLAN_PRICE[form.plan] + Math.max(0, form.vessels - 10) * 2 + Math.max(0, form.api_calls_k - 10) + Math.max(0, form.qpu_jobs - 1) * 12;

  async function load() {
    const s = readSession();
    if (!s?.token) {
      router.replace("/marine-maer/sign-in/?next=/marine-maer/partners/");
      return;
    }
    try {
      setDash(await maerFetch("/maer/partners/dashboard/", { token: s.token }));
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        router.replace("/marine-maer/sign-in/?next=/marine-maer/partners/");
        return;
      }
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createService(e) {
    e.preventDefault();
    const s = readSession();
    try {
      await maerFetch("/maer/partners/offerings/", { method: "POST", token: s.token, body: form });
      await load();
      setTab("sales");
    } catch (err) {
      setError(err.message);
    }
  }

  async function setStatus(kind, id, status) {
    const s = readSession();
    const path = kind === "ticket" ? `/maer/partners/tickets/${id}/` : `/maer/partners/orders/${id}/`;
    await maerFetch(path, { method: "POST", token: s.token, body: { status } });
    await load();
  }

  const k = dash?.kpis || {};

  return (
    <CloudShell crumb={<><Link href="/marine-maer/api-doc/">Maersat Cloud</Link> / Catalog / Marine Maer / Create</>}>
      <div className="maer-kpis">
        <div className="maer-kpi"><span>Monthly revenue</span><strong>{money(k.mrr)}</strong></div>
        <div className="maer-kpi"><span>Open on-call</span><strong>{k.open_tickets ?? "—"}</strong></div>
        <div className="maer-kpi"><span>Active services</span><strong>{k.active_services ?? "—"}</strong></div>
      </div>
      <div className="maer-tabs">
        {["catalog", "sales", "oncall", "customers"].map((id) => (
          <button key={id} type="button" data-on={tab === id ? "true" : "false"} onClick={() => setTab(id)}>
            {id === "oncall" ? "On-call" : id[0].toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
      {error && <p className="maer-error" style={{ padding: "0 24px" }}>{error}</p>}

      {tab === "catalog" && (
        <form className="maer-create" onSubmit={createService}>
          <div className="maer-panel">
            <h2>Create Marine Maer</h2>
            <p style={{ color: "#525252" }}>
              Provision a named coverage instance for a customer theater. Location, plan, and capacity drive the estimate.
            </p>
            <div className="maer-field">
              <label htmlFor="svc">Service name</label>
              <input id="svc" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="maer-field">
              <label htmlFor="region">Coverage region</label>
              <select
                id="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                style={{ width: "100%", padding: 8, font: "inherit" }}
              >
                <option value="north-sea">North Sea / EU-GB</option>
                <option value="mediterranean">Mediterranean / EU-DE</option>
                <option value="singapore">Singapore / AP-SEA</option>
                <option value="gulf">Gulf</option>
              </select>
            </div>
            <p style={{ fontSize: 13, marginBottom: 8 }}>Pricing plan</p>
            <div className="maer-plans">
              {[
                ["maer", "Maer", "$299"],
                ["maer-pro", "Maer Pro", "$449"],
                ["maer-pro-plus", "Maer Pro+", "$499"],
              ].map(([id, name, price]) => (
                <button
                  key={id}
                  type="button"
                  className="maer-plan"
                  data-on={form.plan === id ? "true" : "false"}
                  onClick={() => setForm({ ...form, plan: id })}
                >
                  <b>{name}</b>
                  {price}/mo
                </button>
              ))}
            </div>
            <div className="maer-slider">
              <label><span>Vessels</span><b>{form.vessels}</b></label>
              <input type="range" min="10" max="400" value={form.vessels} onChange={(e) => setForm({ ...form, vessels: Number(e.target.value) })} />
            </div>
            <div className="maer-slider">
              <label><span>API calls (thousands / mo)</span><b>{form.api_calls_k}k</b></label>
              <input type="range" min="10" max="500" value={form.api_calls_k} onChange={(e) => setForm({ ...form, api_calls_k: Number(e.target.value) })} />
            </div>
            <div className="maer-slider">
              <label><span>QPU jobs / day</span><b>{form.qpu_jobs}</b></label>
              <input type="range" min="1" max="100" value={form.qpu_jobs} onChange={(e) => setForm({ ...form, qpu_jobs: Number(e.target.value) })} />
            </div>
          </div>
          <aside className="maer-panel maer-summary">
            <h2>Order summary</h2>
            <dl>
              <dt>Plan</dt><dd>{form.plan}</dd>
              <dt>Region</dt><dd>{form.region}</dd>
              <dt>Vessels</dt><dd>{form.vessels}</dd>
              <dt>Estimated cost</dt><dd>{money(quote)}/mo</dd>
            </dl>
            <button className="maer-btn" type="submit">Create</button>
            <p style={{ fontSize: 12, color: "#525252" }}>
              Vendor: {dash?.vendor?.name || session?.user?.org || "—"}
            </p>
          </aside>
        </form>
      )}

      {tab === "sales" && (
        <div className="maer-panel" style={{ margin: 24 }}>
          <h2>Sales and provisioned services</h2>
          <table className="maer-table">
            <thead><tr><th>Service</th><th>Plan</th><th>Region</th><th>Monthly</th><th>Status</th></tr></thead>
            <tbody>
              {(dash?.offerings || []).map((o) => (
                <tr key={o.id}><td>{o.name}</td><td>{o.plan}</td><td>{o.region}</td><td>{money(o.monthly_usd)}</td><td><span className="maer-pill ok">{o.status}</span></td></tr>
              ))}
              {(dash?.sales || []).map((s) => (
                <tr key={s.id}><td>Closed {s.month}</td><td>—</td><td>—</td><td>{money(s.usd)}</td><td>{s.seats} seats</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "oncall" && (
        <div className="maer-panel" style={{ margin: 24 }}>
          <h2>On-call queue</h2>
          <table className="maer-table">
            <thead><tr><th>Ticket</th><th>Severity</th><th>Status</th><th>SLA</th><th></th></tr></thead>
            <tbody>
              {(dash?.tickets || []).map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.severity}</td>
                  <td><span className="maer-pill warn">{t.status}</span></td>
                  <td>{t.sla_minutes}m</td>
                  <td>
                    <button type="button" className="maer-btn ghost" onClick={() => setStatus("ticket", t.id, "working")}>Working</button>
                    {" "}
                    <button type="button" className="maer-btn ghost" onClick={() => setStatus("ticket", t.id, "resolved")}>Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "customers" && (
        <div className="maer-panel" style={{ margin: 24 }}>
          <h2>Customer services</h2>
          <table className="maer-table">
            <thead><tr><th>Order</th><th>Title</th><th>Monthly</th><th>Status</th><th>Picture</th><th></th></tr></thead>
            <tbody>
              {(dash?.orders || []).map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.title}</td>
                  <td>{money(o.monthly_usd)}</td>
                  <td><span className="maer-pill">{o.status}</span></td>
                  <td><Link href={o.map_href || "/marine-mis/"}>Map</Link></td>
                  <td>
                    <button type="button" className="maer-btn ghost" onClick={() => setStatus("order", o.id, "in-service")}>In service</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CloudShell>
  );
}
