import { SITE } from "../../lib/atalanta/content";

export const metadata = {
  title: "Marine MIS | Live Map",
  description:
    "Maersat Marine MIS — live maritime AIS map with vessel tracking, ports, and satellite-aware fleet intelligence.",
  alternates: { canonical: "/marine-mis/" },
  openGraph: {
    title: `Marine MIS | ${SITE.name}`,
    description:
      "Live maritime intelligence map from Maersat — track vessels, ports, and fleets in one Marine MIS view.",
    url: `${SITE.domain}/marine-mis/`,
  },
};

export default function MarineMisLayout({ children }) {
  return children;
}
