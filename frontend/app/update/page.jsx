import Shell from "../../components/atalanta/Shell";
import Footer from "../../components/atalanta/Footer";
import MaerPricing from "../../components/atalanta/MaerPricing";

export const metadata = {
  title: "Update · Maer Pricing",
  description:
    "Maer by Maersat — Starter, Pro, and Enterprise subscriptions for maritime intelligence, API access, formal verification, and quantum verification.",
  alternates: { canonical: "/update/" },
};

export default function UpdatePage() {
  return (
    <Shell>
      <MaerPricing backHref="/" backLabel="← Back to Home" />
      <Footer />
    </Shell>
  );
}
