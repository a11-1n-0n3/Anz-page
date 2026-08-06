import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

/**
 * Runs per server request: resolve the locale, then load its message file.
 *
 * `hasLocale` checks the value taken from the URL against the supported list —
 * a request for `/fr` falls back to the default locale instead of blowing up
 * at runtime.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
