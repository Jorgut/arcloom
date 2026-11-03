import { createHmac } from "node:crypto";

const MAX_BODY_BYTES = 8_192;
const MAX_PER_IP_PER_DAY = 5;

function send(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(status).json(body);
}

function getPayload(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);
  return {};
}

function isSameOrigin(request) {
  const origin = request.headers.origin;
  const forwardedHost = request.headers["x-forwarded-host"] || request.headers.host;
  if (!origin || !forwardedHost) return false;
  try {
    const originUrl = new URL(origin);
    const requestHost = String(forwardedHost).split(",")[0].trim().toLowerCase();
    const localDevelopment =
      process.env.NODE_ENV !== "production" &&
      originUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(originUrl.hostname);
    return (originUrl.protocol === "https:" || localDevelopment) && originUrl.host.toLowerCase() === requestHost;
  } catch {
    return false;
  }
}

function cleanText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isValidResourceUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

async function countRecentSubmissions({ projectUrl, serviceKey, fingerprint }) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const query = new URLSearchParams({
    select: "id",
    submission_ip_hash: `eq.${fingerprint}`,
    created_at: `gte.${since}`
  });
  const result = await fetch(`${projectUrl}/rest/v1/resource_submissions?${query}`, {
    method: "GET",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: "application/json",
      Range: `0-${MAX_PER_IP_PER_DAY}`,
      Prefer: "count=exact"
    },
    signal: AbortSignal.timeout(5_000)
  });
  if (!result.ok) throw new Error("submission lookup failed");
  const rows = await result.json();
  return Array.isArray(rows) ? rows.length : MAX_PER_IP_PER_DAY;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return send(response, 405, { error: "Method not allowed." });
  }

  const configured =
    process.env.ARCLOOM_SUBMISSIONS_ENABLED === "true" &&
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.ARCLOOM_IP_HASH_SECRET && process.env.ARCLOOM_IP_HASH_SECRET.length >= 32;
  if (!configured) return send(response, 503, { error: "Submissions are not open yet." });
  if (!isSameOrigin(request)) return send(response, 403, { error: "Request origin could not be verified." });

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) return send(response, 413, { error: "Submission is too large." });

  let payload;
  try {
    payload = getPayload(request);
  } catch {
    return send(response, 400, { error: "Invalid request body." });
  }
  if (Buffer.byteLength(JSON.stringify(payload), "utf8") > MAX_BODY_BYTES) {
    return send(response, 413, { error: "Submission is too large." });
  }

  // Quietly accept honeypot submissions without writing them to storage.
  if (cleanText(payload.website, 200)) return send(response, 202, { accepted: true });

  const name = cleanText(payload.name, 80);
  const url = cleanText(payload.url, 500);
  const note = cleanText(payload.note, 400);
  if (name.length < 2 || !isValidResourceUrl(url) || payload.rightsConfirmed !== true) {
    return send(response, 400, { error: "Please provide a name, a valid HTTPS source, and confirm the submission terms." });
  }

  const projectUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const forwardedFor = request.headers["x-forwarded-for"];
  const realIp = request.headers["x-real-ip"];
  const clientIp = typeof forwardedFor === "string"
    ? forwardedFor.split(",")[0].trim()
    : typeof realIp === "string" ? realIp.trim() : "";
  if (!clientIp) return send(response, 400, { error: "Request could not be verified." });

  const fingerprint = createHmac("sha256", process.env.ARCLOOM_IP_HASH_SECRET).update(clientIp).digest("hex");

  try {
    if (await countRecentSubmissions({ projectUrl, serviceKey, fingerprint }) >= MAX_PER_IP_PER_DAY) {
      return send(response, 429, { error: "Too many submissions. Please try again tomorrow." });
    }

    const insert = await fetch(`${projectUrl}/rest/v1/resource_submissions`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        name,
        resource_url: url,
        note: note || null,
        rights_confirmed: true,
        submission_ip_hash: fingerprint
      }),
      signal: AbortSignal.timeout(5_000)
    });
    if (!insert.ok) throw new Error("submission insert failed");
    return send(response, 201, { accepted: true });
  } catch {
    return send(response, 502, { error: "We could not save your submission. Please try again later." });
  }
}
