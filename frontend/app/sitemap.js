import { SITE } from "../lib/atalanta/content";

export default function sitemap() {
  const base = SITE.domain;
  const staticRoutes = [
    "",
    "/platform/",
    "/update/",
    "/products/maer/",
    "/marine-mis/",
    "/articles/all/1/",
    "/articles/research/1/",
    "/articles/ideas/1/",
    "/articles/press/1/",
    "/careers/",
    "/contact/",
    "/privacy-policy/",
    "/terms-of-use/",
    "/learn/",
  ];
  const articleRoutes = [
    "/articles/satellite-resilience/",
    "/articles/software-understanding/",
    "/articles/national-security-gap/",
    "/articles/energy-systems/",
    "/articles/the-age-of-software-understanding/",
  ];

  return [...staticRoutes, ...articleRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("platform") || path.includes("contact") ? 0.9 : 0.7,
  }));
}
