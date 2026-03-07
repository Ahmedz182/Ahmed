"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SplashScreen = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Prevent scrolling while splash screen is active
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            setIsLoading(false);
            // Restore scrolling
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
        }, 2500);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-theme-dark"
                >
                    <div className="fixed inset-0 z-0 bg-theme-dark bg-grid-pattern opacity-10 pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="relative flex items-center justify-center z-10"
                    >
                        {/* Outer rotating ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute w-32 h-32 rounded-full border-2 border-t-accent-mint border-r-transparent border-b-accent-mint/30 border-l-transparent"
                        />
                        {/* Inner rotating ring */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute w-24 h-24 rounded-full border-2 border-t-transparent border-r-soft-mint border-b-transparent border-l-soft-mint/30"
                        />

                        {/* Center AF Logo */}
                        <div className="w-16 h-16 rounded-full bg-theme-dark/80 backdrop-blur-sm border border-white/10 shadow-[0_0_20px_rgba(51,214,159,0.3)] flex items-center justify-center text-accent-mint font-black text-2xl tracking-tighter">
                            AF
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 flex flex-col items-center gap-4 z-10"
                    >
                        <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white uppercase flex gap-2">
                            <span className="flex">
                                {"AHMED".split("").map((char, i) => (
                                    <motion.span
                                        key={`first-${i}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 0.6 + i * 0.1 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                            <span className="flex text-accent-mint disabled:text-white">
                                {"FAYYAZ".split("").map((char, i) => (
                                    <motion.span
                                        key={`last-${i}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: 1.1 + i * 0.1 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        </h2>

                        {/* Loading Bar */}
                        <div className="w-48 h-1 bg-white/5 rounded-full mt-2 overflow-hidden relative shadow-inner">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-accent-mint to-transparent"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
