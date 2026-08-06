import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Next 16 renamed `middleware` to `proxy` — the file must sit at `src/proxy.ts`,
 * alongside `app/`. Behaviour is unchanged from middleware.
 *
 * Its job here: read the URL, cookie and `Accept-Language` header to pick a
 * locale, then rewrite the request into the matching `app/[locale]/` branch.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Skip static assets and anything with a file extension (favicon.ico,
   * images, ...). Without the exclusion the proxy would try to prefix asset
   * paths with a locale.
   *
   * `opengraph-image` has no file extension, so it needs naming explicitly —
   * otherwise the proxy rewrites it into `/vi/opengraph-image`, which does not
   * exist, and every shared link loses its preview image.
   */
  matcher: "/((?!api|trpc|opengraph-image|_next|_vercel|.*\\..*).*)",
};
