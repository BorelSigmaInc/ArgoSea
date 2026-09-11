"use client";

import { TYPE_BY_ID } from "../../lib/aisConstants";
import { CloseIcon } from "./icons";

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toUTCString().replace("GMT", "UTC");
}

export default function VesselInfoWindow({ vessel, onClose, onAddFleet, inFleet }) {
  if (!vessel) return null;
  const meta = TYPE_BY_ID[vessel.type] || TYPE_BY_ID.unspecified;

  return (
    <article className="ais-infowindow">
      <div className="ais-infowindow-bar" style={{ background: meta.color }} />
      <header>
        <div>
          <h3>{vessel.name}</h3>
          <p>
            {vessel.flag} · {meta.label}
            {vessel.verified ? " · API verified" : ""}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close vessel info">
          <CloseIcon />
        </button>
      </header>

      <dl>
        <div><dt>MMSI</dt><dd>{vessel.mmsi}</dd></div>
        <div><dt>IMO</dt><dd>{vessel.imo || "—"}</dd></div>
        <div><dt>Status</dt><dd>{vessel.status}</dd></div>
        <div><dt>Speed / Course</dt><dd>{vessel.speed_kn} kn · {vessel.course_deg}°</dd></div>
        <div><dt>Destination</dt><dd>{vessel.dest}</dd></div>
        <div><dt>ETA</dt><dd>{fmtTime(vessel.eta)}</dd></div>
        <div><dt>Position</dt><dd>{vessel.lat.toFixed(4)}, {vessel.lon.toFixed(4)}</dd></div>
        <div><dt>Draught / LOA</dt><dd>{vessel.draught} m · {vessel.loa} m</dd></div>
        <div><dt>Load</dt><dd>{vessel.load}</dd></div>
        <div><dt>Last position</dt><dd>{fmtTime(vessel.timestamp)}</dd></div>
      </dl>

      <footer>
        <button type="button" className="ais-login" onClick={() => onAddFleet(vessel)} disabled={inFleet}>
          {inFleet ? "In my fleet" : "Add to fleet"}
        </button>
      </footer>
    </article>
  );
}
