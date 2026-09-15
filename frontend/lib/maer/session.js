export const MAER_KEY = "maersat.maer.session";
export const API = "/api/proxy";

export function readSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(MAER_KEY) || "null");
  } catch {
    return null;
  }
}

export function writeSession(session) {
  window.localStorage.setItem(MAER_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(MAER_KEY);
}

export async function maerFetch(path, { method = "GET", body, token } = {}) {
  const headers = { accept: "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.detail || data.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function money(n) {
  return `$${Number(n || 0).toLocaleString("en-US")}`;
}
