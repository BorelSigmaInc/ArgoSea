"use client";

import { use, useEffect, useState } from "react";
import { parseAisHomeSlug } from "../../../../../lib/parseMapPath";

export default function AisHomePage({ params }) {
  const resolved = use(params);
  const initial = parseAisHomeSlug(resolved.slug);
  const [MapView, setMapView] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    import("../../../../../components/ais/AisLiveMap")
      .then((mod) => setMapView(() => mod.default))
      .catch((err) => setError(String(err)));
  }, []);

  if (error) {
    return (
      <div className="ais-shell" style={{ padding: 24 }}>
        Failed to load live map: {error}
      </div>
    );
  }

  if (!MapView) {
    return <div className="ais-shell" style={{ padding: 24 }}>Loading live map…</div>;
  }

  return <MapView initial={initial} />;
}
