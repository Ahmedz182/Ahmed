"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * ScrollToTop Component
 * A floating button on the bottom-right that appears after scrolling down.
 * Provides smooth scrolling back to the top of the page.
 */
export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Toggle visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-accent-mint text-theme-dark rounded-full shadow-[0_10px_25px_rgba(51,214,159,0.25)] hover:shadow-[0_15px_30px_rgba(51,214,159,0.4)] transition-all group"
                    aria-label="Scroll"
                >{/* Tooltip */}
                    <span className="absolute bottom-full mb-4 px-3 py-1.5 bg-theme-dark/95 backdrop-blur-md border border-white/10 text-white text-[10px] font-black  tracking-widest rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0 duration-300">
                        Scroll Up
                    </span>
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-1 transition-transform duration-300" />


                </motion.button>
            )}
        </AnimatePresence>
    );
};
