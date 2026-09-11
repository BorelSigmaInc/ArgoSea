import { PORTS } from "./ports";

const PREFIXES = {
  cargo: ["MSC", "EVER", "COSCO", "MAERSK", "CMA CGM", "HAPAG", "ONE", "OOCL", "YM", "ZIM"],
  tanker: ["FRONT", "NORDIC", "STI", "MARAN", "SEAWAYS", "BW", "GENER8", "OCEAN"],
  passenger: ["MS", "MV", "AIDAblu", "QUEEN", "CELEBRITY", "NORWEGIAN"],
  hsc: ["FASTCAT", "SUPERFAST", "JET"],
  tug: ["SMIT", "SVITZER", "FAIRPLAY", "VB", "MULTRATUG"],
  fishing: ["FV", "STAR", "ATLANTIC", "PACIFIC"],
  pleasure: ["SY", "MY", "LADY"],
  unspecified: ["MV", "UN"],
};

const NAMES = [
  "OSCAR", "GIVEN", "ALGECIRAS", "SHANGHAI", "ROTTERDAM", "HORIZON", "PIONEER",
  "ATLANTIC", "PACIFIC", "VOYAGER", "TITAN", "ORION", "AURORA", "NEPTUNE",
  "TRIDENT", "MERIDIAN", "EQUINOX", "POLARIS", "CALYPSO", "ODYSSEY", "MAERSAT",
  "SIRIUS", "ANDA", "FORTUNE", "HARMONY", "UNITY", "SPIRIT", "CROWN",
];

const FLAGS = ["PA", "LR", "MH", "SG", "MT", "HK", "GR", "NO", "DK", "CN", "JP", "US", "GB", "NL", "DE", "CY", "BS"];

const ROUTES = [
  [[31.23, 121.47], [22.29, 114.16], [1.26, 103.82], [5.9, 95.3], [6.9, 79.85], [12.0, 51.0], [21.5, 39.1], [29.9, 32.55], [31.26, 32.31], [35.2, 24.0], [36.1, 14.5], [36.14, -5.35], [38.0, -9.5], [43.4, -9.4], [49.0, -5.5], [50.8, 1.3], [51.95, 4.14]],
  [[35.45, 139.65], [34.4, 135.2], [31.23, 121.47], [35.1, 129.04], [37.5, 137.0], [41.8, 141.7], [50.0, 160.0], [52.0, -170.0], [48.5, -125.0], [47.59, -122.35], [37.8, -122.5], [33.74, -118.27]],
  [[31.23, 121.47], [25.0, 135.0], [21.3, 157.8], [20.0, -160.0], [21.3, -157.8], [32.7, -117.2], [33.74, -118.27]],
  [[51.95, 4.14], [50.0, -8.0], [47.0, -20.0], [42.0, -40.0], [40.67, -74.04]],
  [[36.14, -5.35], [28.0, -16.0], [15.0, -25.0], [13.0, -59.0], [18.0, -66.0], [25.8, -80.13], [29.73, -95.27]],
  [[36.14, -5.35], [18.0, -18.0], [4.0, -10.0], [-8.0, -14.0], [-23.96, -46.3]],
  [[1.26, 103.82], [-6.1, 106.88], [-8.5, 115.2], [-12.0, 130.0], [-20.0, 150.0], [-27.4, 153.1], [-33.85, 151.21], [-37.84, 144.93]],
  [[1.26, 103.82], [-5.0, 80.0], [-20.0, 55.0], [-29.87, 31.04], [-33.91, 18.43], [-20.0, 5.0], [6.43, 3.41], [14.7, -17.4], [28.1, -15.4], [36.14, -5.35]],
  [[25.01, 55.06], [25.12, 56.35], [22.5, 60.0], [14.5, 53.0], [12.6, 43.3], [21.5, 39.1], [29.9, 32.55]],
  [[29.73, -95.27], [26.1, -80.1], [18.4, -77.0], [12.5, -80.0], [8.95, -79.57], [8.8, -79.5], [4.0, -80.0], [-2.0, -82.0], [-12.0, -77.1]],
  [[51.95, 4.14], [53.55, 9.97], [55.7, 12.6], [59.3, 18.1], [60.15, 24.96]],
  [[40.99, 28.99], [37.94, 23.63], [35.9, 14.5], [36.8, 10.3], [41.1, 16.9], [43.3, 5.3], [41.35, 2.18], [39.44, -0.32], [36.13, -5.43]],
  [[18.95, 72.84], [13.08, 80.29], [6.95, 79.85], [1.26, 103.82]],
  [[-23.96, -46.3], [-15.0, -5.0], [0.0, 8.0], [6.43, 3.41], [14.7, -17.4]],
  [[22.6, 120.28], [14.58, 120.96], [10.3, 107.0], [1.26, 103.82]],
  [[49.29, -123.11], [47.59, -122.35], [37.8, -122.5], [32.7, -117.2], [19.4, -99.1]],
];

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function pointOnRoute(route, t) {
  const segs = route.length - 1;
  const scaled = t * segs;
  const i = Math.min(segs - 1, Math.floor(scaled));
  const local = scaled - i;
  const [lat1, lon1] = route[i];
  const [lat2, lon2] = route[i + 1];
  const lat = lerp(lat1, lat2, local);
  const lon = lerp(lon1, lon2, local);
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const course = ((Math.atan2(dLon, dLat) * 180) / Math.PI + 360) % 360;
  return { lat, lon, course };
}

function typeForRoute(rand, coastal) {
  const roll = rand();
  if (coastal) {
    if (roll < 0.28) return "tug";
    if (roll < 0.46) return "fishing";
    if (roll < 0.58) return "pleasure";
    if (roll < 0.7) return "passenger";
    if (roll < 0.82) return "cargo";
    if (roll < 0.92) return "tanker";
    if (roll < 0.97) return "hsc";
    return "unspecified";
  }
  if (roll < 0.48) return "cargo";
  if (roll < 0.72) return "tanker";
  if (roll < 0.8) return "passenger";
  if (roll < 0.86) return "hsc";
  if (roll < 0.93) return "unspecified";
  return "cargo";
}

function pad(n, w) {
  return String(n).padStart(w, "0");
}

export function generateFleet(count = 2800, seed = 20260911) {
  const rand = mulberry32(seed);
  const vessels = [];

  for (let i = 0; i < count; i += 1) {
    const coastal = rand() < 0.22;
    const type = typeForRoute(rand, coastal);
    const route = pick(rand, ROUTES);
    const t = rand();
    const pos = pointOnRoute(route, t);
    const jitter = coastal ? 7.5 : 6.2;
    const lat = pos.lat + (rand() - 0.5) * jitter;
    const lon = pos.lon + (rand() - 0.5) * jitter * 1.6;
    const stopped = rand() < (coastal ? 0.35 : 0.08);
    const dest = pick(rand, PORTS);
    const origin = pick(rand, PORTS);
    const speed = stopped ? +(rand() * 0.4).toFixed(1) : +((type === "hsc" ? 28 : 11) + rand() * 14).toFixed(1);
    const course = stopped ? +(rand() * 360).toFixed(1) : +((pos.course + (rand() - 0.5) * 18 + 360) % 360).toFixed(1);
    const prefix = pick(rand, PREFIXES[type] || PREFIXES.unspecified);
    const name = `${prefix} ${pick(rand, NAMES)} ${pad(Math.floor(rand() * 90) + 1, 2)}`;
    const etaHours = 12 + Math.floor(rand() * 240);

    vessels.push({
      id: `v${i}`,
      name,
      mmsi: 200000000 + i,
      imo: 9000000 + i,
      type,
      lat: +lat.toFixed(4),
      lon: +lon.toFixed(4),
      speed_kn: speed,
      course_deg: course,
      heading: course,
      status: stopped ? "At Anchor" : "Under Way Using Engine",
      stopped,
      dest: dest.name,
      origin: origin.name,
      flag: pick(rand, FLAGS),
      draught: +(6 + rand() * 12).toFixed(1),
      loa: Math.round(80 + rand() * 320),
      eta: new Date(Date.now() + etaHours * 3600 * 1000).toISOString(),
      timestamp: new Date(Date.now() - Math.floor(rand() * 18 * 60 * 1000)).toISOString(),
      load: pick(rand, ["Laden", "Ballast", "Partly Laden"]),
    });
  }

  PORTS.forEach((port, idx) => {
    vessels.push({
      id: `aton-${idx}`,
      name: `${port.name} Lt`,
      mmsi: 990000000 + idx,
      imo: null,
      type: "aton",
      lat: port.lat + 0.04,
      lon: port.lon + 0.05,
      speed_kn: 0,
      course_deg: 0,
      heading: 0,
      status: "Aid to Navigation",
      stopped: true,
      dest: port.name,
      origin: port.name,
      flag: port.country,
      draught: 0,
      loa: 0,
      eta: null,
      timestamp: new Date().toISOString(),
      load: "—",
    });
  });

  return vessels;
}

export function jitterFleet(vessels, seedOffset = 1) {
  const rand = mulberry32(20260911 + seedOffset);
  return vessels.map((v) => {
    if (v.type === "aton" || v.stopped) return { ...v, timestamp: new Date().toISOString() };
    const kn = v.speed_kn;
    const distDeg = (kn * 1.852) / 111 / 60;
    const rad = (v.course_deg * Math.PI) / 180;
    return {
      ...v,
      lat: +(v.lat + Math.cos(rad) * distDeg * (0.6 + rand())).toFixed(4),
      lon: +(v.lon + Math.sin(rad) * distDeg * (0.6 + rand())).toFixed(4),
      timestamp: new Date().toISOString(),
    };
  });
}

export function enrichApiFleet(apiVessels = []) {
  return apiVessels.map((v, i) => ({
    id: `api-${v.mmsi ?? i}`,
    name: v.name || `MAERSAT ${v.mmsi ?? i}`,
    mmsi: v.mmsi,
    imo: v.imo || null,
    type: v.type || "unspecified",
    lat: v.lat,
    lon: v.lon,
    speed_kn: v.speed_kn,
    course_deg: v.course_deg,
    heading: v.course_deg,
    status: v.speed_kn < 0.5 ? "At Anchor" : "Under Way Using Engine",
    stopped: v.speed_kn < 0.5,
    dest: v.dest || "—",
    origin: v.origin || "—",
    flag: v.flag || "UN",
    draught: v.draught || 8.0,
    loa: v.loa || 180,
    eta: v.eta || null,
    timestamp: v.timestamp,
    load: "Verified",
    verified: true,
  }));
}
