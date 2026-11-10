// Base URL of the Next.js app (Payload's REST and MCP endpoints live there).
// Set APP_URL in each environment, e.g. https://www.conversion-century.com in
// production and http://localhost:3000 locally.
export function appUrl(): string {
  const url =
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return url.replace(/\/$/, "");
}
