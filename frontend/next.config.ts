import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is deployed on a small 1-core / 2GB VPS. The type-check and ESLint
  // phases of `next build` are the memory hot-spot (they OOM the box). They are a
  // dev/CI concern, not required to emit the runtime bundle, so skip them here.
  // Run `tsc --noEmit` / `eslint` separately (e.g. on a dev machine or CI) for safety.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
