import Header from "./Header";
import LogoSplash from "./LogoSplash";
import PageMotion from "./PageMotion";
import Pattern from "./Pattern";
import ViewportVars from "./ViewportVars";

export default function Shell({ children }) {
  return (
    <div className="at-page">
      <ViewportVars />
      <LogoSplash />
      <PageMotion />
      <Pattern />
      <div className="at-vline" aria-hidden="true" />
      <Header />
      {children}
    </div>
  );
}
