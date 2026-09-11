import "./globals.css";
import "./atalanta.css";
import { SITE } from "../lib/atalanta/content";

export const metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: `${SITE.name} | Maritime Intelligence & Provable Decision-Making`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.legalName, url: SITE.domain }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.domain,
    siteName: SITE.name,
    title: `${SITE.name} | Maritime Intelligence & Provable Decision-Making`,
    description: SITE.description,
    images: [
      {
        url: "/media/hero-earth.jpg",
        width: 1500,
        height: 500,
        alt: "Maersat — maritime and satellite intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Maritime Intelligence`,
    description: SITE.tagline,
    images: ["/media/hero-earth.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/media/marine-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#37352f",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.domain,
  logo: `${SITE.domain}/media/marine-logo.svg`,
  email: SITE.email,
  description: SITE.description,
  sameAs: [
    "https://www.linkedin.com/company/maersat",
    "https://x.com/maersat",
    "https://www.youtube.com/@Maersat",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: SITE.email,
      contactType: "customer support",
      url: `${SITE.domain}/contact/`,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/FTAktualTrial-Light.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FTAktualTrial-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/FTAktualTrial-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MDLorienTrial-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
