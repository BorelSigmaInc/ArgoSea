/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  agentRules: false,
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
