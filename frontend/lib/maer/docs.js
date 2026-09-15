export const DOC_NAV = [
  {
    heading: "Get started",
    items: [
      { id: "overview", label: "What is Marine Maer?" },
      { id: "dashboard", label: "The dashboard overview" },
      { id: "pricing", label: "Pricing" },
      { id: "hosting", label: "Hosting models" },
    ],
  },
  {
    heading: "How to",
    items: [
      { id: "provision", label: "Provisioning a service" },
      { id: "connect", label: "Getting connection strings" },
      { id: "users", label: "Managing users and roles" },
      { id: "oncall", label: "On-call and SLA" },
      { id: "map", label: "Connecting Marine MIS" },
    ],
  },
  {
    heading: "Reference",
    items: [
      { id: "api", label: "Marine Maer API" },
      { id: "endpoints", label: "Public ArgoSea endpoints" },
      { id: "auth", label: "Identity" },
      { id: "flow", label: "Business and program flow" },
    ],
  },
  {
    heading: "Help",
    items: [
      { id: "faq", label: "FAQs" },
      { id: "troubleshoot", label: "Troubleshooting" },
    ],
  },
];

export const DOC_PAGES = {
  overview: {
    title: "Marine Maer",
    dek: "Maritime intelligence as a managed service — live AIS, formal proof, and QPU-verified routing.",
    body: [
      "Marine Maer is Maersat’s catalog offering for certified vendors and their customers. It follows the same operating shape as a managed cloud data service: provision a named instance, pick a region and plan, then connect applications.",
      "Customers estimate and order coverage. Vendors track sales, on-call work, and live service status. The shared picture is Marine MIS, with a durable map URL for each operating theater.",
    ],
  },
  dashboard: {
    title: "The dashboard overview",
    dek: "Partners operate from Catalog → Sales → On-call → Customers.",
    body: [
      "The partner console is the create-and-operate view: configure a Maer instance on the left, read the monthly estimate on the right, then manage live tickets and orders below.",
      "KPI tiles show MRR, open tickets, and active services. Status changes persist on the ArgoSea API (`/maer/partners/*`).",
    ],
  },
  pricing: {
    title: "Pricing",
    dek: "Maer $299 · Maer Pro $449 · Maer Pro+ $499, plus on-call.",
    body: [
      "Plans map to API volume, verification quota, and QPU jobs. The catalog estimator adds line items (AIS live, z3 proof, QPU routing, 24/7 on-call) and quotes a monthly total before a customer places an order.",
    ],
  },
  hosting: {
    title: "Hosting models",
    dek: "API on Hetzner :8010 · web on Vercel or maer-marine.q-dit.com via Cloudflare Tunnel.",
    body: [
      "The FastAPI service stays on the shared Hetzner host at port 8010 so sibling projects keep their ports. The Next.js console is reached at /marine-maer/*.",
      "maer-marine.q-dit.com is an extra hostname on the existing q-dit.com user-space Cloudflare Tunnel. No nginx and no sudo.",
    ],
  },
  provision: {
    title: "Provisioning a service",
    dek: "Name, region, plan, then allocate vessels, API calls, and QPU jobs.",
    body: [
      "Open Partners → Catalog. This is the create flow: service name, coverage region, Maer plan, and resource sliders. The order summary updates as you type. Create writes `/maer/partners/offerings`.",
    ],
  },
  connect: {
    title: "Getting connection strings",
    dek: "Applications call the ArgoSea API through the HTTPS proxy.",
    body: [
      "Customer and partner browsers use `/api/proxy/maer/...` so mixed-content never hits Hetzner HTTP directly. curl examples in the API reference use the same paths.",
    ],
  },
  users: {
    title: "Managing users and roles",
    dek: "vendor · customer · operator",
    body: [
      "Sign-in is a Maersat ID (email then password), same two-step pattern as a cloud IBMid login. Role decides the home: partners, user estimator, or this documentation.",
      "Demo IDs: partner@maersat.com, user@maersat.com, ops@maersat.com. Password: Maer-Console-2026.",
    ],
  },
  oncall: {
    title: "On-call and SLA",
    dek: "Sev-2 maritime tickets default to a 30-minute vendor SLA.",
    body: [
      "Vendors accept, escalate, or resolve tickets from the On-call table. Each transition is stored and visible to the customer timeline.",
    ],
  },
  map: {
    title: "Connecting Marine MIS",
    dek: "The live tracking webpage is the operating picture for both business and program flow.",
    body: [
      "Marine MIS keeps center and zoom in the path (`centerx`, `centery`, `zoom`) so a theater is shareable. Demo overlay is generated locally; API-verified positions come from `GET /fleet`.",
      "Reference viewport for Black Sea / Bosporus review: /marine-mis/centerx:27.8/centery:44.0/zoom:3/",
    ],
  },
  api: {
    title: "Marine Maer API",
    dek: "Authenticated JSON for console state.",
    body: [
      "POST /maer/login · GET /maer/me · GET /maer/catalog · GET /maer/flow",
      "GET/POST /maer/partners/dashboard and /maer/partners/offerings",
      "GET/POST /maer/user/workspace, /maer/user/estimates, /maer/user/orders",
    ],
  },
  endpoints: {
    title: "Public ArgoSea endpoints",
    dek: "Unchanged operational API.",
    body: [
      "GET /health · GET /status · GET /fleet · GET /verify · GET /quantum/runs · GET /overview",
    ],
  },
  auth: {
    title: "Identity",
    dek: "Bearer session, 12-hour expiry, stored only in the browser.",
    body: [
      "The sign-in page never sends a password until step two. Tokens are opaque server sessions in data/maer/store.json on the API host.",
    ],
  },
  flow: {
    title: "Business and program flow",
    dek: "End-to-end path for client review.",
    body: [
      "Business: estimate → order → vendor accept → on-call → live map coverage.",
      "Program: Next.js marine-maer routes → /api/proxy → FastAPI /maer → JSON store; Marine MIS is a separate Leaflet client with URL-synced geography.",
    ],
  },
  faq: {
    title: "FAQs",
    dek: "Common console questions.",
    body: [
      "Why two front doors? Marketing stays on maersat.com. Console UX matches a cloud catalog so vendors and customers can provision without training.",
      "Where is Redis? This offering is not a Redis host. The catalog UX is modeled on a managed-service create page; the product is maritime coverage.",
    ],
  },
  troubleshoot: {
    title: "Troubleshooting",
    dek: "If the console cannot reach the API.",
    body: [
      "Confirm GET /health on the API host returns version 0.4.0+. The proxy must allow POST. If login fails, use a demo Maersat ID exactly as documented.",
    ],
  },
};
