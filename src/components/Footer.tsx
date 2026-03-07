"use client";

import { ArrowUp } from "lucide-react";

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="w-full border-t border-white/5 bg-theme-dark relative z-10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); scrollToTop(); }}
                        className="text-2xl font-bold tracking-tighter text-white hover:text-accent-mint transition-colors mb-2 inline-block"
                    >
                        MF<span className="text-accent-mint">.</span>
                    </a>
                    <p className="text-text-muted text-sm font-medium">
                        Building interfaces of the future.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <a href="#about" className="text-sm font-medium text-text-muted hover:text-white transition-colors">About</a>
                    <a href="#projects" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Projects</a>
                    <a href="#contact" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Contact</a>
                </div>

                <button
                    onClick={scrollToTop}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-accent-mint hover:text-theme-dark hover:border-transparent transition-all group"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-text-muted text-xs font-semibold tracking-wide">
                    © {new Date().getFullYear()} Ahmed Fayyaz. All rights reserved.
                </p>
                <p className="text-text-muted text-xs font-semibold tracking-wide flex items-center">
                    Designed with <span className="text-accent-mint mx-1">&hearts;</span>By Ahmed using Next.js & Tailwind
                </p>
            </div>
        </footer>
    );
};
