"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CloudShell from "./CloudShell";
import { maerFetch, money, readSession } from "../../lib/maer/session";

export default function UserView() {
  const router = useRouter();
  const [ws, setWs] = useState(null);
  const [picked, setPicked] = useState(["cat-ais"]);
  const [region, setRegion] = useState("north-sea");
  const [vendor, setVendor] = useState("v-northsea");
  const [error, setError] = useState("");
  const [estimate, setEstimate] = useState(null);

  async function load() {
    const s = readSession();
    if (!s?.token) {
      router.replace("/marine-maer/sign-in/?next=/marine-maer/user/");
      return;
    }
    try {
      setWs(await maerFetch("/maer/user/workspace/", { token: s.token }));
    } catch (err) {
      if (err.status === 401) {
        router.replace("/marine-maer/sign-in/?next=/marine-maer/user/");
        return;
      }
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const catalog = ws?.catalog || [];
  const selected = catalog.filter((c) => picked.includes(c.id));
  const total = selected.reduce((sum, c) => sum + c.price, 0);

  function toggle(id) {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function saveEstimate() {
    const s = readSession();
    try {
      const est = await maerFetch("/maer/user/estimates/", {
        method: "POST",
        token: s.token,
        body: { items: picked, region, vendor_id: vendor },
      });
      setEstimate(est);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function place(sku) {
    const s = readSession();
    try {
      await maerFetch("/maer/user/orders/", {
        method: "POST",
        token: s.token,
        body: {
          sku,
          vendor_id: vendor,
          region,
          estimate_id: estimate?.id,
        },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <CloudShell crumb={<><Link href="/marine-maer/user/">Cost estimator</Link> / Marine Maer / Customer</>}>
      <div className="maer-create">
        <div className="maer-panel">
          <h2>Add products</h2>
          <p style={{ color: "#525252" }}>
            Select coverage from certified Maersat vendors. Totals are monthly. Tracking continues after you place the order.
          </p>
          {catalog.map((item) => (
            <label key={item.id} className="maer-check">
              <input type="checkbox" checked={picked.includes(item.id)} onChange={() => toggle(item.id)} />
              <span>
                <b>{item.name}</b>
                <div style={{ color: "#525252", fontSize: 13 }}>{item.blurb}</div>
              </span>
              <span style={{ marginLeft: "auto" }}>{money(item.price)}/{item.unit}</span>
            </label>
          ))}
          <div className="maer-field">
            <label htmlFor="uregion">Region</label>
            <select id="uregion" value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: "100%", padding: 8, font: "inherit" }}>
              <option value="north-sea">North Sea / EU-GB</option>
              <option value="mediterranean">Mediterranean / EU-DE</option>
              <option value="singapore">Singapore / AP-SEA</option>
              <option value="gulf">Gulf</option>
            </select>
          </div>
          <div className="maer-field">
            <label htmlFor="uvendor">Vendor</label>
            <select id="uvendor" value={vendor} onChange={(e) => setVendor(e.target.value)} style={{ width: "100%", padding: 8, font: "inherit" }}>
              {(ws?.vendors || []).map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.region})</option>
              ))}
            </select>
          </div>
        </div>
        <aside className="maer-panel maer-summary">
          <h2>Estimate</h2>
          <div className="maer-total">{money(total)}/mo</div>
          <p style={{ color: "#525252", fontSize: 13 }}>{selected.length} products · {region}</p>
          {error && <p className="maer-error">{error}</p>}
          <button type="button" className="maer-btn" onClick={saveEstimate} style={{ marginBottom: 8 }}>Save estimate</button>
          <button type="button" className="maer-btn" onClick={() => place(selected[0]?.sku || "AIS-LIVE")}>Place service order</button>
        </aside>
      </div>

      <div className="maer-panel" style={{ margin: 24 }}>
        <h2>My services</h2>
        <table className="maer-table">
          <thead><tr><th>Order</th><th>Service</th><th>Monthly</th><th>Status</th><th>Live picture</th></tr></thead>
          <tbody>
            {(ws?.orders || []).map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.title}</td>
                <td>{money(o.monthly_usd)}</td>
                <td><span className="maer-pill ok">{o.status}</span></td>
                <td><Link href={o.map_href || "/marine-mis/centerx:27.8/centery:44.0/zoom:3/"}>Open map</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="maer-panel" style={{ margin: "0 24px 32px" }}>
        <h2>Service tracking</h2>
        <ul className="maer-timeline">
          {(ws?.events || []).map((evt) => (
            <li key={evt.id}>
              <b>{evt.label}</b>
              <div style={{ color: "#525252", fontSize: 12 }}>{evt.at}</div>
            </li>
          ))}
        </ul>
      </div>
    </CloudShell>
  );
}
