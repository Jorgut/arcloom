export default function handler(_request, response) {
  const submissionsEnabled =
    process.env.ARCLOOM_SUBMISSIONS_ENABLED === "true" &&
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    Boolean(process.env.ARCLOOM_IP_HASH_SECRET && process.env.ARCLOOM_IP_HASH_SECRET.length >= 32);

  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({ submissionsEnabled });
}
