import "./maer-cloud.css";

export const metadata = {
  title: "Marine Maer",
  description: "Maersat Cloud — Marine Maer console, docs, partners, and estimator.",
};

export default function MaerLayout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400&display=swap"
      />
      {children}
    </>
  );
}
