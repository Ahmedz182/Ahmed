"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Stats } from "@/components/Stats";
import { BentoGrid } from "@/components/BentoGrid";
import { Blog } from "@/components/Blog";
import { BentoServices } from "@/components/BentoServices";
import { Contact } from "@/components/Contact";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full text-white font-sans bg-theme-dark overflow-hidden">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 z-0 bg-theme-dark bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{
        background: 'linear-gradient(135deg, #0B3D2E 0%, #0E5A45 40%, rgba(7, 30, 47, 0) 100%)'
      }} />

      <main className="relative z-10 flex flex-col items-center justify-center w-full">
        <Hero />
        <About />
        <BentoGrid />
        <Skills />
        <Stats />
        <Experience />
        <Projects />
        <BentoServices />
        <Blog />
        <Contact />
      </main>
    </div>
  );
}
