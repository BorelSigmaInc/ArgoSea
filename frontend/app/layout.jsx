import "./globals.css";
import "./atalanta.css";

export const metadata = {
  title: "Home | Atalanta",
  description: "Provably correct decision-making for the world's most important missions.",
  icons: {
    icon: "/media/marine-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="https://www.atalanta.tech/fonts/FTAktualTrial-Light.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://www.atalanta.tech/fonts/FTAktualTrial-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://www.atalanta.tech/fonts/FTAktualTrial-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://www.atalanta.tech/fonts/MDLorienTrial-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
