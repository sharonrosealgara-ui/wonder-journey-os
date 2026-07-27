export function getAppUrl() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url.slice(0, -1) : url;
  return url;
}
