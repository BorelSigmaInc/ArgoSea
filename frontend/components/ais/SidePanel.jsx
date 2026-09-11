"use client";

import { VESSEL_TYPES, MAP_STYLES } from "../../lib/aisConstants";
import { CloseIcon } from "./icons";

export default function SidePanel({
  active,
  onClose,
  query,
  onQuery,
  searchHits,
  onPickHit,
  filters,
  onToggleType,
  onToggleAll,
  mapStyle,
  onMapStyle,
  showNames,
  onShowNames,
  showPorts,
  onShowPorts,
  showSeamarks,
  onShowSeamarks,
  playback,
  onPlayback,
  weatherOn,
  onWeather,
  fleet,
  onFocusFleet,
}) {
  if (!active) return null;

  const titles = {
    search: "Search",
    layers: "Map layers",
    filters: "Vessel filters",
    fleet: "My fleets",
    playback: "Playback",
    weather: "Weather",
    settings: "Settings",
  };

  return (
    <section className="ais-panel" id={active}>
      <header>
        <h2>{titles[active]}</h2>
        <button type="button" onClick={onClose} aria-label="Close panel">
          <CloseIcon />
        </button>
      </header>

      {active === "search" && (
        <div className="ais-panel-body">
          <input
            className="ais-field"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Name, MMSI, IMO or port"
          />
          <ul className="ais-hits">
            {searchHits.length === 0 && <li className="muted">No matches</li>}
            {searchHits.map((hit) => (
              <li key={hit.key}>
                <button type="button" onClick={() => onPickHit(hit)}>
                  <b>{hit.title}</b>
                  <span>{hit.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active === "layers" && (
        <div className="ais-panel-body">
          <p className="ais-label">Map type</p>
          <div className="ais-pills">
            {Object.values(MAP_STYLES).map((s) => (
              <button
                key={s.id}
                type="button"
                className={mapStyle === s.id ? "on" : ""}
                onClick={() => onMapStyle(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="ais-check">
            <input type="checkbox" checked={showNames} onChange={(e) => onShowNames(e.target.checked)} />
            Display vessel names
          </label>
          <label className="ais-check">
            <input type="checkbox" checked={showPorts} onChange={(e) => onShowPorts(e.target.checked)} />
            Ports
          </label>
          <label className="ais-check">
            <input type="checkbox" checked={showSeamarks} onChange={(e) => onShowSeamarks(e.target.checked)} />
            Nautical seamarks
          </label>
        </div>
      )}

      {active === "filters" && (
        <div className="ais-panel-body">
          <div className="ais-row">
            <button type="button" className="ais-link" onClick={() => onToggleAll(true)}>
              Enable all
            </button>
            <button type="button" className="ais-link" onClick={() => onToggleAll(false)}>
              Disable all
            </button>
          </div>
          {VESSEL_TYPES.map((t) => (
            <label key={t.id} className="ais-check">
              <input
                type="checkbox"
                checked={filters[t.id] !== false}
                onChange={() => onToggleType(t.id)}
              />
              <span className="ais-swatch" style={{ background: t.color }} />
              {t.label}
            </label>
          ))}
          <p className="muted small">
            Colour of each icon is the vessel type. Pointing triangles show course; circles are stopped.
          </p>
        </div>
      )}

      {active === "fleet" && (
        <div className="ais-panel-body">
          <p className="muted">Demo fleet — vessels marked verified from the ArgoSea API.</p>
          {fleet.length === 0 && <p className="muted">No saved vessels yet. Click a ship and add it.</p>}
          <ul className="ais-hits">
            {fleet.map((v) => (
              <li key={v.id}>
                <button type="button" onClick={() => onFocusFleet(v)}>
                  <b>{v.name}</b>
                  <span>{v.mmsi} · {v.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active === "playback" && (
        <div className="ais-panel-body">
          <p className="ais-label">Replay window (hours ago → now)</p>
          <input
            type="range"
            min="0"
            max="24"
            value={playback}
            onChange={(e) => onPlayback(Number(e.target.value))}
          />
          <p className="muted">{playback === 24 ? "Live" : `${24 - playback}h ago (demo offset)`}</p>
        </div>
      )}

      {active === "weather" && (
        <div className="ais-panel-body">
          <label className="ais-check">
            <input type="checkbox" checked={weatherOn} onChange={(e) => onWeather(e.target.checked)} />
            Wind / swell overlay (demo)
          </label>
          <p className="muted small">
            Production weather tiles can be wired to a licensed marine weather provider. This toggle is for layout review.
          </p>
        </div>
      )}

      {active === "settings" && (
        <div className="ais-panel-body">
          <p className="muted small">
            Map URL follows <code>centerx</code> / <code>centery</code> / <code>zoom</code> like the source AIS home path.
            Positions are synthetic shipping-lane traffic for local review — not a third-party live feed.
          </p>
        </div>
      )}
    </section>
  );
}
