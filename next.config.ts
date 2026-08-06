import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

/**
 * The next-intl plugin points at `src/i18n/request.ts`, which loads the right
 * message file for each request.
 */
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
