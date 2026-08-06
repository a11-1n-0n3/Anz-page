import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware replacements for `next/link`, `useRouter`, `redirect`...
 *
 * IMPORTANT: always import `Link` from here, never from `next/link`. The
 * next-intl version adds the `/en` prefix while the visitor is on English;
 * using `next/link` by mistake drops them back to Vietnamese mid-session.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
