/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "marine.maersat.com"],
  agentRules: false,
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/argo", destination: "/platform/", permanent: true },
      { source: "/argo/", destination: "/platform/", permanent: true },
      { source: "/products/maer", destination: "/update/", permanent: true },
      { source: "/products/maer/", destination: "/update/", permanent: true },
      { source: "/articles/viasat-announcement", destination: "/articles/satellite-resilience/", permanent: true },
      { source: "/articles/viasat-announcement/", destination: "/articles/satellite-resilience/", permanent: true },
      { source: "/articles/national-press-club-remarks", destination: "/articles/software-understanding/", permanent: true },
      { source: "/articles/national-press-club-remarks/", destination: "/articles/software-understanding/", permanent: true },
      { source: "/articles/software-understanding-and-U.S.-national-security", destination: "/articles/national-security-gap/", permanent: true },
      { source: "/articles/software-understanding-and-U.S.-national-security/", destination: "/articles/national-security-gap/", permanent: true },
      { source: "/articles/inl-announcement", destination: "/articles/energy-systems/", permanent: true },
      { source: "/articles/inl-announcement/", destination: "/articles/energy-systems/", permanent: true },
      { source: "/quantum", destination: "/internal/", permanent: false },
      { source: "/quantum/", destination: "/internal/", permanent: false },
    ];
  },
};

export default nextConfig;
