import Shell from "../../../components/atalanta/Shell";
import Footer from "../../../components/atalanta/Footer";
import MaerPricing from "../../../components/atalanta/MaerPricing";

export const metadata = {
  title: "Maer – Pricing & Feature Matrix",
  description:
    "Maer by Maersat — Starter, Pro, and Enterprise subscriptions for maritime intelligence, API access, formal verification, and quantum verification.",
  alternates: { canonical: "/update/" },
};

/** Legacy product path — same Maer matrix as /update. */
export default function MaerProductPage() {
  return (
    <Shell>
      <MaerPricing />
      <Footer />
    </Shell>
  );
}
