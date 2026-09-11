export const DEFAULT_CENTERX = 13.2; // longitude
export const DEFAULT_CENTERY = 13.8; // latitude
export const DEFAULT_ZOOM = 3;

export const REFRESH_SECONDS = 60;

export const VESSEL_TYPES = [
  { id: "cargo", label: "Cargo Vessels", color: "#2e7d32", shape: "triangle" },
  { id: "tanker", label: "Tankers", color: "#c62828", shape: "triangle" },
  { id: "passenger", label: "Passenger Vessels", color: "#1565c0", shape: "triangle" },
  { id: "hsc", label: "High Speed Craft", color: "#f9a825", shape: "triangle" },
  { id: "tug", label: "Tugs & Special Craft", color: "#00838f", shape: "triangle" },
  { id: "fishing", label: "Fishing", color: "#ef6c00", shape: "triangle" },
  { id: "pleasure", label: "Pleasure Craft", color: "#ad1457", shape: "triangle" },
  { id: "unspecified", label: "Unspecified Ships", color: "#616161", shape: "triangle" },
  { id: "aton", label: "Navigation Aids", color: "#212121", shape: "diamond" },
];

export const TYPE_BY_ID = Object.fromEntries(VESSEL_TYPES.map((t) => [t.id, t]));

export const MAP_STYLES = {
  simple: {
    id: "simple",
    label: "Simple",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles &copy; Esri",
  },
  satellite: {
    id: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "Tiles &copy; Esri",
  },
  nautical: {
    id: "nautical",
    label: "Nautical",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

export const OPENSEAMAP_URL = "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png";
