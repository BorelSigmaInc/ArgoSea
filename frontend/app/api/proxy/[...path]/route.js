// frontend/app/api/proxy/[...path]/route.js
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.UPSTREAM_API_URL || "http://46.224.200.113:8010";

async function handler(request, context) {
  const { path } = await context.params;
  const joined = (path || []).filter(Boolean).join("/").replace(/\/$/, "");
  const url = `${UPSTREAM}/${joined}`;
  const headers = { accept: "application/json" };
  const auth = request.headers.get("authorization");
  if (auth) headers.authorization = auth;
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const init = {
    method: request.method,
    headers,
    cache: "no-store",
  };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }

  try {
    const upstream = await fetch(url, init);
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "upstream_unreachable", detail: String(err), url }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const HEAD = handler;
