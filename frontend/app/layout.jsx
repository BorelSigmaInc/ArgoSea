// frontend/app/layout.jsx
export const metadata = {
  title: "ArgoSea — Provably Correct Maritime Decisions",
  description: "Quantum-verified maritime intelligence platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#0b0f14",
        color: "#e6edf3",
      }}>
        {children}
      </body>
    </html>
  );
}
