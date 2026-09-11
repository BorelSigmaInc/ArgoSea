"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { MAP_STYLES, OPENSEAMAP_URL, REFRESH_SECONDS, VESSEL_TYPES } from "../../lib/aisConstants";
import { generateFleet, jitterFleet, enrichApiFleet } from "../../lib/generateFleet";
import { PORTS } from "../../lib/ports";
import { buildAisHomePath } from "../../lib/parseMapPath";
import TopBar from "./TopBar";
import RightToolbar from "./RightToolbar";
import SidePanel from "./SidePanel";
import VesselInfoWindow from "./VesselInfoWindow";
import VesselCanvasLayer from "./VesselCanvasLayer";

function MapSync({ onView }) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onView({ lat: c.lat, lon: c.lng, zoom: e.target.getZoom() });
    },
    zoomend: (e) => {
      const c = e.target.getCenter();
      onView({ lat: c.lat, lon: c.lng, zoom: e.target.getZoom() });
    },
  });
  return null;
}

function MapApi({ apiRef }) {
  const map = useMapEvents({});
  apiRef.current = map;
  return null;
}

export default function AisLiveMap({
  initial,
  buildPath = buildAisHomePath,
  homeHref = "/en/ais/home/centerx:13.2/centery:13.8/zoom:3",
}) {
  const [mapApi, setMapApi] = useState(null);
  const [vessels, setVessels] = useState(() => generateFleet());
  const [tick, setTick] = useState(0);
  const [countdown, setCountdown] = useState(REFRESH_SECONDS);
  const [activeTool, setActiveTool] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [fleet, setFleet] = useState([]);
  const [mapStyle, setMapStyle] = useState("simple");
  const [showNames, setShowNames] = useState(false);
  const [showPorts, setShowPorts] = useState(false);
  const [showSeamarks, setShowSeamarks] = useState(false);
  const [weatherOn, setWeatherOn] = useState(false);
  const [playback, setPlayback] = useState(24);
  const [filters, setFilters] = useState(
    Object.fromEntries(VESSEL_TYPES.map((t) => [t.id, true]))
  );

  useEffect(() => {
    fetch("/api/proxy/fleet")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setVessels((prev) => {
          const ids = new Set(prev.map((v) => v.mmsi));
          const extra = enrichApiFleet(data).filter((v) => !ids.has(v.mmsi));
          return extra.length ? [...prev, ...extra] : prev;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setTick((t) => t + 1);
          setVessels((prev) => jitterFleet(prev, Date.now() % 10000));
          return REFRESH_SECONDS;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(() => {
    setVessels((prev) => jitterFleet(prev, Date.now() % 10000));
    setCountdown(REFRESH_SECONDS);
    setTick((t) => t + 1);
  }, []);

  const visible = useMemo(() => {
    const hourShift = (24 - playback) / 24;
    return vessels.filter((v) => {
      if (filters[v.type] === false) return false;
      if (hourShift > 0.01 && v.type !== "aton") {
        // demo: hide a slice of traffic in older playback frames
        const n = Number(String(v.mmsi).slice(-2));
        if (n < hourShift * 40) return false;
      }
      return true;
    });
  }, [vessels, filters, playback, tick]);

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const vesselHits = vessels
      .filter((v) =>
        [v.name, String(v.mmsi), String(v.imo || ""), v.dest]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 12)
      .map((v) => ({
        key: v.id,
        title: v.name,
        subtitle: `${v.mmsi} · ${v.type} · ${v.dest}`,
        kind: "vessel",
        payload: v,
      }));
    const portHits = PORTS.filter((p) => p.name.toLowerCase().includes(q)).map((p) => ({
      key: `port-${p.name}`,
      title: p.name,
      subtitle: `Port · ${p.country}`,
      kind: "port",
      payload: p,
    }));
    return [...portHits, ...vesselHits].slice(0, 16);
  }, [query, vessels]);

  const onView = useCallback((view) => {
    const path = buildPath({
      centerx: view.lon,
      centery: view.lat,
      zoom: view.zoom,
    });
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  }, [buildPath]);

  const flyTo = useCallback((lat, lon, zoom = 8) => {
    const map = mapApi;
    if (map) map.flyTo([lat, lon], zoom, { duration: 0.8 });
  }, [mapApi]);

  const onPickHit = useCallback((hit) => {
    if (hit.kind === "vessel") {
      setSelected(hit.payload);
      flyTo(hit.payload.lat, hit.payload.lon, 7);
    } else {
      setSelected(null);
      flyTo(hit.payload.lat, hit.payload.lon, 8);
    }
  }, [flyTo]);

  const onSelect = useCallback((v) => setSelected(v), []);

  const addFleet = useCallback((v) => {
    setFleet((prev) => (prev.some((x) => x.id === v.id) ? prev : [...prev, v]));
    setActiveTool("fleet");
  }, []);

  const tile = MAP_STYLES[mapStyle] || MAP_STYLES.simple;

  return (
    <div className="ais-shell">
      <TopBar
        homeHref={homeHref}
        query={query}
        onQuery={(q) => {
          setQuery(q);
          setActiveTool("search");
        }}
        onSearch={() => setActiveTool("search")}
      />

      <div className="ais-map-wrap">
        <MapContainer
          center={[initial.centery, initial.centerx]}
          zoom={initial.zoom}
          zoomControl={false}
          minZoom={2}
          maxZoom={18}
          worldCopyJump
          className="ais-map"
        >
          <TileLayer attribution={tile.attr} url={tile.url} />
          {showSeamarks && (
            <TileLayer url={OPENSEAMAP_URL} attribution="&copy; OpenSeaMap" opacity={0.85} />
          )}
          {showPorts &&
            PORTS.map((p) => (
              <CircleMarker
                key={p.name}
                center={[p.lat, p.lon]}
                radius={4}
                pathOptions={{ color: "#7b1fa2", weight: 1, fillColor: "#ab47bc", fillOpacity: 0.9 }}
              >
                <Tooltip direction="top" offset={[0, -6]}>{p.name}</Tooltip>
              </CircleMarker>
            ))}
          <VesselCanvasLayer
            vessels={visible}
            selectedId={selected?.id}
            showNames={showNames}
            onSelect={onSelect}
          />
          <MapSync onView={onView} />
          <MapBinder onReady={setMapApi} />
        </MapContainer>

        {weatherOn && <div className="ais-weather-veil" />}

        <RightToolbar
          active={activeTool}
          onToggle={(id) => setActiveTool((cur) => (cur === id ? null : id))}
          vesselCount={visible.length}
          countdown={countdown}
          onRefresh={refresh}
          onZoomIn={() => mapApi?.zoomIn()}
          onZoomOut={() => mapApi?.zoomOut()}
        />

        <SidePanel
          active={activeTool}
          onClose={() => setActiveTool(null)}
          query={query}
          onQuery={setQuery}
          searchHits={searchHits}
          onPickHit={onPickHit}
          filters={filters}
          onToggleType={(id) => setFilters((f) => ({ ...f, [id]: !f[id] }))}
          onToggleAll={(on) =>
            setFilters(Object.fromEntries(VESSEL_TYPES.map((t) => [t.id, on])))
          }
          mapStyle={mapStyle}
          onMapStyle={setMapStyle}
          showNames={showNames}
          onShowNames={setShowNames}
          showPorts={showPorts}
          onShowPorts={setShowPorts}
          showSeamarks={showSeamarks}
          onShowSeamarks={setShowSeamarks}
          playback={playback}
          onPlayback={setPlayback}
          weatherOn={weatherOn}
          onWeather={setWeatherOn}
          fleet={fleet}
          onFocusFleet={(v) => {
            setSelected(v);
            flyTo(v.lat, v.lon, 7);
          }}
        />

        <VesselInfoWindow
          vessel={selected}
          onClose={() => setSelected(null)}
          onAddFleet={addFleet}
          inFleet={!!selected && fleet.some((x) => x.id === selected.id)}
        />

        <div className="ais-scale">
          Demo AIS overlay · {visible.length.toLocaleString()} objects · zoom follows URL
        </div>
      </div>
    </div>
  );
}

function MapBinder({ onReady }) {
  const map = useMapEvents({});
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}
