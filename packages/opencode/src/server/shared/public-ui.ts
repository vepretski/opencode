// Static UI assets the browser fetches without app-managed credentials, e.g.
// the manifest link in <head> or <script>/<link> subresources in the HTML page.
// These bypass auth so the page can render even when a server password is
// configured.  API/data routes are still protected by the typed auth middleware.
const STATIC_ASSET_EXTENSIONS = /\.(js|css|ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot|map|json)(\?.*)?$/i

const PUBLIC_UI_PREFIXES = [
  "/assets/",
]

export function isPublicUIPath(method: string, pathname: string) {
  if (method !== "GET") return false
  if (PUBLIC_UI_PREFIXES.some((p) => pathname.startsWith(p))) return true
  if (STATIC_ASSET_EXTENSIONS.test(pathname)) return true
  return PUBLIC_UI_PATHS.has(pathname)
}

export const PUBLIC_UI_PATHS = new Set<string>([
  "/site.webmanifest",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/favicon.ico",
  "/favicon.svg",
])
