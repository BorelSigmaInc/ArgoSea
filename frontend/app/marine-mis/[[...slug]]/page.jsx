"use client";

import { use, useEffect, useState } from "react";
import {
  buildMarineMisPath,
  MARINE_MIS_HOME,
  parseMarineMisSlug,
} from "../../../lib/parseMapPath";

export default function MarineMisPage({ params }) {
  const resolved = use(params);
  const initial = parseMarineMisSlug(resolved.slug);
  const [MapView, setMapView] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    import("../../../components/ais/AisLiveMap")
      .then((mod) => setMapView(() => mod.default))
      .catch((err) => setError(String(err)));
  }, []);

  // Normalize bare /marine-mis/ into the shareable center/zoom path (keeps AIS home untouched).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const parts = (resolved.slug || []).filter(Boolean);
    if (parts.length === 0) {
      const target = `${MARINE_MIS_HOME}/`;
      if (!window.location.pathname.includes("centerx:")) {
        window.history.replaceState(null, "", target);
      }
    }
  }, [resolved.slug]);

  if (error) {
    return (
      <div className="ais-shell" style={{ padding: 24 }}>
        Failed to load Marine MIS map: {error}
      </div>
    );
  }

  if (!MapView) {
    return <div className="ais-shell" style={{ padding: 24 }}>Loading Marine MIS…</div>;
  }

  return (
    <MapView
      initial={initial}
      buildPath={buildMarineMisPath}
      homeHref={MARINE_MIS_HOME}
    />
  );
}
