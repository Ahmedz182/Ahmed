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
import { SplineShowcase } from "@/components/SplineShowcase";

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
      {/* Base + grid */}


      {/* Radial vignette — fades grid at far edges so it looks lit from center */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 70% at 50% 40%, transparent 30%, rgba(7,30,47,0.85) 100%)'
      }} />

      {/* Subtle color tint — reduced so grid stays visible */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(11,61,46,0.25) 0%, rgba(14,90,69,0.18) 40%, transparent 70%)',
      }} />

      {/* Top-left corner bloom */}
      <div className="fixed top-0 left-0 w-[700px] h-[700px] z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at top left, rgba(51,214,159,0.13) 0%, transparent 65%)'
      }} />
      {/* Bottom-right corner bloom */}
      <div className="fixed bottom-0 right-0 w-[700px] h-[700px] z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at bottom right, rgba(51,214,159,0.10) 0%, transparent 65%)'
      }} />
      {/* Center horizontal glow strip */}
      <div className="fixed top-1/2 left-0 right-0 h-px z-0 pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(51,214,159,0.15) 30%, rgba(51,214,159,0.25) 50%, rgba(51,214,159,0.15) 70%, transparent 100%)',
        transform: 'translateY(-50%)',
        filter: 'blur(1px)',
      }} />

      <main className="relative z-10 flex flex-col items-center justify-center w-full">
        <Hero />
        <About />
        <BentoGrid />
        <Skills />
        <SplineShowcase />
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
