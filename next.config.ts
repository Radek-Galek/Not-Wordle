import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Ensure public extras are inlined into the client bundle at build time
  env: {
    NEXT_PUBLIC_EN_EXTRA_WORDS: process.env.NEXT_PUBLIC_EN_EXTRA_WORDS ?? "",
    NEXT_PUBLIC_EN_EXTRA_CHANCE: process.env.NEXT_PUBLIC_EN_EXTRA_CHANCE ?? "0.25",
  },
};

export default nextConfig;
