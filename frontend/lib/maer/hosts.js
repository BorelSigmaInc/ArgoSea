export function isMarineConsoleHost(hostHeader) {
  const host = String(hostHeader || "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  return host === "maer-marine.q-dit.com" || host === "marine.maersat.com";
}
