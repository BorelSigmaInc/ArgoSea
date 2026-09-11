import Header from "./Header";
import Pattern from "./Pattern";
import ViewportVars from "./ViewportVars";

export default function Shell({ children }) {
  return (
    <div className="at-page">
      <ViewportVars />
      <Pattern />
      <div className="at-vline" aria-hidden="true" />
      <Header />
      {children}
    </div>
  );
}
