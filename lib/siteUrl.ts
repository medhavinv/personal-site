/**
 * Canonical site origin, used for metadataBase, robots, and the sitemap.
 *
 * Set NEXT_PUBLIC_SITE_URL to the production domain. On Vercel, the deployed
 * production URL is used as a fallback so link previews work before a custom
 * domain is configured.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
