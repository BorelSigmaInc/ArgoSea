import { DEFAULT_CENTERX, DEFAULT_CENTERY, DEFAULT_ZOOM } from "./aisConstants";

export function parseAisHomeSlug(slug = []) {
  const out = {
    centerx: DEFAULT_CENTERX,
    centery: DEFAULT_CENTERY,
    zoom: DEFAULT_ZOOM,
  };
  for (const raw of slug) {
    const part = decodeURIComponent(String(raw));
    const idx = part.indexOf(":");
    if (idx < 0) continue;
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    if (key === "centerx") out.centerx = Number(value);
    if (key === "centery") out.centery = Number(value);
    if (key === "zoom") out.zoom = Number(value);
  }
  if (!Number.isFinite(out.centerx)) out.centerx = DEFAULT_CENTERX;
  if (!Number.isFinite(out.centery)) out.centery = DEFAULT_CENTERY;
  if (!Number.isFinite(out.zoom)) out.zoom = DEFAULT_ZOOM;
  return out;
}

export function buildAisHomePath({ centerx, centery, zoom }) {
  return `/en/ais/home/centerx:${centerx.toFixed(1)}/centery:${centery.toFixed(1)}/zoom:${Math.round(zoom)}`;
}
