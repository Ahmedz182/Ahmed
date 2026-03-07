import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import NextTopLoader from "nextjs-toploader";

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
        <SplashScreen />
        <NextTopLoader
          color="#33D69F"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #33D69F,0 0 5px #33D69F"
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
