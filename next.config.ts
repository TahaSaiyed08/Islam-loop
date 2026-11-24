import type { NextConfig } from "next";

// Default: a normal Next.js build (Vercel-ready, zero config).
// DEPLOY_TARGET=static: a static export into out/ (optionally under BASE_PATH).
const isStatic = process.env.DEPLOY_TARGET === "static";
const basePath = isStatic ? (process.env.BASE_PATH ?? "") : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        ...(basePath ? { basePath } : {}),
      }
    : {
        headers: async () => [{ source: "/(.*)", headers: securityHeaders }],
      }),
};

export default nextConfig;
