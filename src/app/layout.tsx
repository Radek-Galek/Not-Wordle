import type { Metadata, Viewport } from "next";
import { Outfit, Archivo_Black } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const tiles = Outfit({
  variable: "--font-tiles",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Five",
  description: "Unlimited five-letter word game. English & Polish. No ads.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${tiles.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-hidden">{children}</body>
    </html>
  );
}
