import { DEFAULT_CENTERX, DEFAULT_CENTERY, DEFAULT_ZOOM } from "./aisConstants";

export const MARINE_MIS_CENTERX = 27.8;
export const MARINE_MIS_CENTERY = 44.0;
export const MARINE_MIS_ZOOM = 3;
export const MARINE_MIS_HOME = `/marine-mis/centerx:${MARINE_MIS_CENTERX.toFixed(1)}/centery:${MARINE_MIS_CENTERY.toFixed(1)}/zoom:${MARINE_MIS_ZOOM}`;

function parseMapSlug(slug = [], defaults) {
  const out = { ...defaults };
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
  if (!Number.isFinite(out.centerx)) out.centerx = defaults.centerx;
  if (!Number.isFinite(out.centery)) out.centery = defaults.centery;
  if (!Number.isFinite(out.zoom)) out.zoom = defaults.zoom;
  return out;
}

export function parseAisHomeSlug(slug = []) {
  return parseMapSlug(slug, {
    centerx: DEFAULT_CENTERX,
    centery: DEFAULT_CENTERY,
    zoom: DEFAULT_ZOOM,
  });
}

export function parseMarineMisSlug(slug = []) {
  return parseMapSlug(slug, {
    centerx: MARINE_MIS_CENTERX,
    centery: MARINE_MIS_CENTERY,
    zoom: MARINE_MIS_ZOOM,
  });
}

export function buildAisHomePath({ centerx, centery, zoom }) {
  return `/en/ais/home/centerx:${centerx.toFixed(1)}/centery:${centery.toFixed(1)}/zoom:${Math.round(zoom)}`;
}

export function buildMarineMisPath({ centerx, centery, zoom }) {
  return `/marine-mis/centerx:${centerx.toFixed(1)}/centery:${centery.toFixed(1)}/zoom:${Math.round(zoom)}`;
}
