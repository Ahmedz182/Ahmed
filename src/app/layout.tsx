import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ahmed Fayyaz | Software Engineer",
  description: "Software Engineer specializing in Frontend Development and MERN Stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={clsx(nunitoSans.variable, "antialiased bg-theme-dark overflow-x-hidden w-full min-h-screen text-white selection:bg-accent-mint/30")}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
