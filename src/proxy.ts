import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next 16: middleware lives here as proxy.ts
export default createMiddleware(routing);

export const config = {
  // opengraph-image has no extension — name it or locale rewrite kills OG
  matcher: "/((?!api|trpc|opengraph-image|_next|_vercel|.*\\..*).*)",
};
