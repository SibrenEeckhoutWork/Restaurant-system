import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['socket.io-client', 'engine.io-client'],
};

export default nextConfig;
