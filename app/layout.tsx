import type { Metadata } from "next";
import { Inter } from "next/font/google";
import oboStar from "next/font/local";
import ThemeWrapper from "@/components/ThemeWrapper"; // Import the Client Component
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const obo = oboStar({
  src: "../public/fonts/obostartest-regular.otf",
  variable: "--font-obo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NerdWork",
  description: "It is a comic reviewing website that is built",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.variable} ${obo.variable}`}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}