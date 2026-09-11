// frontend/app/api/proxy/[...path]/route.js
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.UPSTREAM_API_URL || "http://46.224.200.113:8010";

async function handler(request, context) {
  const { path } = await context.params; // Next.js 16: params is a Promise
  const joined = (path || []).join("/");
  const url = `${UPSTREAM}/${joined}`;

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    });
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
