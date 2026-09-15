import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Shell from "../components/atalanta/Shell";
import Footer from "../components/atalanta/Footer";
import ContactSection from "../components/atalanta/ContactSection";
import HeroLanding from "../components/atalanta/HeroLanding";
import Reveal from "../components/atalanta/Reveal";
import StickyCards from "../components/atalanta/StickyCards";
import PatternDivider from "../components/atalanta/PatternDivider";
import { SITE } from "../lib/atalanta/content";
import { isMarineConsoleHost } from "../lib/maer/hosts";

export const metadata = {
  title: "Home",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host") || "";
  if (isMarineConsoleHost(host)) {
    redirect("/marine-maer/sign-in/");
  }

  return (
    <Shell>
      <main>
        <HeroLanding />

        <Reveal mode="rich">
          <section className="at-section at-text-large-reveal" id="problem" data-text-reveal>
            <div className="at-side"><span className="at-sq" /> The Problem</div>
            <div className="at-copy at-copy-reveal">
              <p className="c1">The most important systems in the world are now software-defined and increasingly autonomous. But we cannot yet prove that they will perform correctly in the real world.</p>
              <p className="c2">Testing shows how systems behave in known scenarios. It cannot prove the absence of failure in unknown ones.</p>
              <p className="c3">Mathematical proof can establish these guarantees, but it has historically been too slow and too specialized to deploy at the speed high-stakes missions demand.</p>
              <p className="c3">This creates a widening gap between the software powering these systems and our ability to understand how it will operate.</p>
            </div>
          </section>
        </Reveal>

        <PatternDivider />

        <StickyCards />

        <ContactSection />
      </main>

      <Footer />
    </Shell>
  );
}
