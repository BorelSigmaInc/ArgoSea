import { Inter_Tight, Newsreader } from "next/font/google";
import "./globals.css";
import "./atalanta.css";

const heading = Inter_Tight({
  subsets: ["latin"],
  variable: "--at-head",
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--at-body",
  display: "swap",
});

export const metadata = {
  title: "MarineMIS",
  description: "Provably correct decision-making for the world's most important missions.",
  icons: {
    icon: "/media/marine-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
