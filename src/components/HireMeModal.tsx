"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

export const HireMeModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("openHireModal", handleOpen);
        return () => window.removeEventListener("openHireModal", handleOpen);
    }, []);

    const closeModal = () => setIsOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsOpen(false);
            alert("Project request sent successfully!");
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pt-10 pb-4 md:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-theme-dark/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-theme-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Let's Work Together</h3>
                                <p className="text-text-secondary text-sm mt-1">Tell me about your project and I'll get back to you soon.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors border border-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="hireForm" onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Full Name <span className="text-accent-mint">*</span></label>
                                        <input required type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Email Address <span className="text-accent-mint">*</span></label>
                                        <input required type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Estimated Budget</label>
                                        <select defaultValue="" className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all appearance-none">
                                            <option value="" disabled>Select a range</option>
                                            <option value="< $1000">Less than $1,000</option>
                                            <option value="$1k - $5k">$1,000 - $5,000</option>
                                            <option value="$5k - $10k">$5,000 - $10,000</option>
                                            <option value="$10k+">$10,000+</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Project Idea / Details <span className="text-accent-mint">*</span></label>
                                    <textarea required rows={4} placeholder="Describe your project requirements, goals, and timeline..." className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all resize-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Any Reference Links?</label>
                                    <input type="url" placeholder="https://example.com/inspiration" className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all" />
                                </div>

                                <label className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-theme-dark text-accent-mint focus:ring-accent-mint/50 focus:ring-offset-0 transition-all cursor-pointer accent-accent-mint" />
                                    </div>
                                    <span className="text-sm font-medium text-white">I want to book an introductory call</span>
                                </label>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4 mt-auto">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="hireForm"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accent-mint hover:bg-soft-mint text-theme-dark font-bold transition-all shadow-[0_0_20px_rgba(51,214,159,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : (
                                    <>
                                        Submit Request
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
