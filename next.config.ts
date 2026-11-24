import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Static export for shared hosting (Hostinger Premium has no Node): BUILD_STATIC=true npm run build.
// Dynamic routes are exported once with "_" as placeholder; public/.htaccess maps real URLs to them.
const isStatic = process.env.BUILD_STATIC === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStatic ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default withNextIntl(nextConfig);
