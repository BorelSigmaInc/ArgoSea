export const SITE = {
  name: "Maersat",
  legalName: "Maersat Technologies Inc.",
  domain: "https://www.maersat.com",
  email: "info@maersat.com",
  tagline: "Maritime intelligence and provably correct decision-making for the world's most important missions.",
  description:
    "Maersat is a mathematical AI and maritime intelligence company. Search Maersat for satellite-aware fleets, software understanding, and mission-critical verification across energy, space, and defense.",
  keywords: [
    "Maersat",
    "MAERSAT",
    "Maersat Technologies",
    "Maersat Technologies Inc",
    "Maersat platform",
    "Maersat maritime",
    "Maersat AIS",
    "info@maersat.com",
    "maersat.com",
    "maritime intelligence",
    "satellite AIS",
    "software understanding",
    "formal methods",
    "mission-critical AI",
    "fleet monitoring",
    "marine systems",
  ],
};

export const UPDATE = {
  title: "Maersat Demonstrates Improved Resilience of Satellite Networks Against Modern Warfare Threats",
  href: "/articles/satellite-resilience/",
  image: "/media/hero-earth.jpg",
};

export const ARTICLES = [
  {
    slug: "satellite-resilience",
    category: "Press",
    date: "2026",
    author: "Maersat Newsroom",
    title: "Maersat Demonstrates Improved Resilience of Satellite Networks Against Modern Warfare Threats",
    dek: "As satellite communications face record levels of attack, Maersat proves these systems can be made more resilient.",
    featured: false,
    body: [
      "Maersat partners with operators and defense teams to validate and demonstrate improved resilience of satellite networks against modern warfare threats.",
      "Satellite jamming has become a near-daily occurrence in conflict zones. Maersat makes it possible to both validate and demonstrate progress in hardening mission-critical communications.",
      "Maersat continuously re-validates whether systems can maintain reliable communications as requirements and adversarial conditions change.",
      "Closing the software understanding gap helps mitigate urgent risk in contested environments — Maersat makes it possible to prove which systems can withstand today’s threats.",
    ],
  },
  {
    slug: "software-understanding",
    category: "Ideas",
    date: "2026",
    author: "Maersat",
    title: "Speed Without Sacrificing Safety",
    dek: "Remarks from Maersat on why software understanding is the third path between deploy and restrict.",
    featured: false,
    body: [
      "We are constantly presented with false choices when it comes to technology. Speed or safety. Deploy or restrict. Innovate or regulate.",
      "Software understanding offers a third path — one where capability and safety are verified together.",
      "Maersat is a mathematical AI company. Our platform combines AI for speed, formal methods for rigor, and digital engineering for systems thinking.",
      "You cannot defend what you cannot comprehend. Maersat exists to close that gap for maritime, energy, space, and defense missions.",
    ],
  },
  {
    slug: "national-security-gap",
    category: "Research",
    date: "2026",
    author: "Maersat Research",
    title: "Closing the Gap: Software Understanding and National Security",
    dek: "A Maersat research brief on why the software understanding gap is a national-security vulnerability.",
    featured: false,
    body: [
      "This Maersat research brief examines how the software understanding gap creates national-security risk.",
      "Incidents across critical infrastructure show failures of software understanding — Maersat builds tools to make complex systems legible and verifiable.",
    ],
  },
  {
    slug: "energy-systems",
    category: "Press",
    date: "2026",
    author: "Maersat Newsroom",
    title: "Maersat Partners to Safely Accelerate Critical Energy Infrastructure",
    dek: "As autonomy enters high-consequence domains, Maersat is used to prove mission-critical systems perform as intended.",
    featured: false,
    body: [
      "Maersat Technologies delivers provably correct decision-making for the world’s most important missions across energy, space, and defense.",
      "To close the software-understanding gap, Maersat embeds proof directly into high-impact workflows while maintaining operational speed.",
      "Maersat helps energy operators prove safety constraints, human-in-the-loop workflows, and failure modes before deployment.",
    ],
  },
  {
    slug: "the-age-of-software-understanding",
    category: "Ideas",
    date: "2026",
    author: "Maersat",
    title: "The Age of Software Understanding",
    dek: "An essay from Maersat on mathematical guarantees at mission speed.",
    featured: true,
    body: [
      "I. Introducing Maersat — We are a mathematical AI and maritime intelligence company with a vision to bring provably correct decision-making to the world’s most important missions.",
      "II. Back to the Building Blocks — The dominant paradigm has been probabilistic. In the domains that matter most, we must move toward provable guarantees using formal methods.",
      "III. The Age of Software Understanding — Local correctness does not translate to system reliability. Software Understanding makes complex systems legible, verifiable, and aligned across teams.",
      "IV. The Maersat Platform — Maersat combines AI, formal methods, and digital engineering to deliver systems that are faster, cheaper, and safer — updating proofs as requirements evolve.",
    ],
  },
];

export const JOBS = [
  {
    group: "Engineering",
    title: "Formal Methods Engineer",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Help architect and build the mathematical reasoning engine that powers Maersat. Design and apply formalized proofs that translate ambiguous mission requirements into machine-verifiable guarantees.",
  },
  {
    group: "Engineering",
    title: "Software Engineer",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Develop the Maersat platform — our AI-enabled mathematical reasoning and maritime intelligence system.",
  },
  {
    group: "Engineering",
    title: "Forward Deployed Engineer",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Understand real-world mission needs, design how Maersat is deployed, and ensure successful adoption in the field.",
  },
  {
    group: "Design",
    title: "Product Designer",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Design the core Maersat experience, turning complex system reasoning into intuitive workflows for energy, space, and defense teams.",
  },
  {
    group: "Strategy",
    title: "Policy Strategist",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Translate technical capability into clear narratives and help establish software understanding as a global priority.",
  },
  {
    group: "Strategy",
    title: "Growth Strategist",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Scale early Maersat deployments into sustained programs across national security and critical infrastructure.",
  },
  {
    group: "Strategy",
    title: "Business Operations Strategist",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Build the systems that turn strategy into execution so Maersat can scale without losing speed.",
  },
  {
    group: "Research",
    title: "Software Understanding Researcher (PhD Intern)",
    type: "Full-Time",
    location: "Remote / Global",
    blurb: "Advance AI-driven reasoning and verification by combining machine learning with formal methods at Maersat.",
  },
];

export function articleBySlug(slug) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(cat) {
  if (!cat || cat === "all") return ARTICLES;
  return ARTICLES.filter((a) => a.category.toLowerCase() === cat.toLowerCase());
}
