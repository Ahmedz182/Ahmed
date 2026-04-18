"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiJavascript, SiMongodb } from "react-icons/si";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from 'sileo';
import { useRouter } from "next/navigation";

export default function HirePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        budget: "",
        projectType: "",
        details: "",
        referenceLinks: "",
        bookCall: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "hires"), {
                ...formData,
                createdAt: serverTimestamp(),
                status: "pending"
            });
            sileo.success({ description: "Project request sent successfully! We'll be in touch soon." });

            // Clear form
            setFormData({
                name: "",
                email: "",
                phone: "",
                budget: "",
                projectType: "",
                details: "",
                referenceLinks: "",
                bookCall: false
            });

            // Redirect after a short delay so the toast is visible
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error: any) {
            console.error("Error submitting project request:", error);
            const errorMessage = error.code === 'permission-denied'
                ? "Database access denied. Please check your Firestore rules."
                : "An error occurred while sending your request. Please try again later.";
            sileo.error({ description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const floatingIcons = [
        { icon: <FaReact className="w-12 h-12" />, x: "10%", y: "15%", duration: 15, delay: 0 },
        { icon: <SiNextdotjs className="w-14 h-14" />, x: "85%", y: "20%", duration: 18, delay: 2 },
        { icon: <SiTailwindcss className="w-10 h-10" />, x: "15%", y: "75%", duration: 20, delay: 1 },
        { icon: <SiJavascript className="w-16 h-16" />, x: "80%", y: "80%", duration: 22, delay: 3 },
        { icon: <FaNodeJs className="w-12 h-12" />, x: "50%", y: "10%", duration: 16, delay: 4 },
        { icon: <SiMongodb className="w-10 h-10" />, x: "5%", y: "45%", duration: 19, delay: 2.5 },
        { icon: <FaHtml5 className="w-12 h-12" />, x: "90%", y: "50%", duration: 17, delay: 1.5 },
        { icon: <FaGithub className="w-14 h-14" />, x: "45%", y: "85%", duration: 21, delay: 3.5 },
    ];

    return (
        <div className="relative w-full min-h-screen text-white font-sans bg-theme-dark overflow-x-hidden flex flex-col items-center py-10 px-6 md:px-12">
            {/* Background ambient gradient */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{
                background: 'linear-gradient(135deg, #0B3D2E 0%, #0E5A45 40%, rgba(7, 30, 47, 0) 100%)'
            }} />

            {/* Floating Background Icons */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {floatingIcons.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0.05, 0.15, 0.05],
                            scale: [1, 1.1, 1],
                            y: [0, -40, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: item.duration,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                        className="absolute text-accent-mint"
                        style={{ left: item.x, top: item.y }}
                    >
                        {item.icon}
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-3xl pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Let's Work <span className="text-accent-mint">Together</span></h1>
                    <p className="text-lg text-text-secondary mb-12">Tell me about your project and I'll get back to you soon.</p>

                    <div className="bg-white/[0.03] border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-md">
                        <form id="hireForm" onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-secondary tracking-wide">FULL NAME <span className="text-accent-mint">*</span></label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-secondary tracking-wide">EMAIL ADDRESS <span className="text-accent-mint">*</span></label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-secondary tracking-wide">PHONE NUMBER</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-text-secondary tracking-wide">ESTIMATED BUDGET</label>
                                    <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all appearance-none font-medium [&>option]:bg-theme-dark">
                                        <option value="" disabled className="text-text-muted/50">Select a range</option>
                                        <option value="< $1000">Less than $1,000</option>
                                        <option value="$1k - $5k">$1,000 - $5,000</option>
                                        <option value="$5k - $10k">$5,000 - $10,000</option>
                                        <option value="$10k+">$10,000+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary tracking-wide">PROJECT TYPE <span className="text-accent-mint">*</span></label>
                                <select required name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all appearance-none font-medium [&>option]:bg-theme-dark">
                                    <option value="" disabled className="text-text-muted/50">How would you like to hire me?</option>
                                    <option value="Project Wise">Project Wise (Fixed Rate)</option>
                                    <option value="Monthly Hire">Monthly Hire (Retainer)</option>
                                    <option value="Hourly Hire">Hourly Hire ($10 / hour)</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary tracking-wide">PROJECT IDEA / DETAILS <span className="text-accent-mint">*</span></label>
                                <textarea required name="details" value={formData.details} onChange={handleChange} rows={5} placeholder="Describe your project requirements, goals, and timeline..." className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all resize-none font-medium" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-secondary tracking-wide">ANY REFERENCE LINKS?</label>
                                <input type="url" name="referenceLinks" value={formData.referenceLinks} onChange={handleChange} placeholder="https://example.com/inspiration" className="w-full px-5 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium" />
                            </div>

                            <label className="flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="bookCall" checked={formData.bookCall} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-theme-dark text-accent-mint focus:ring-accent-mint/50 focus:ring-offset-0 transition-all cursor-pointer accent-accent-mint" />
                                </div>
                                <span className="font-medium text-white">I want to book an introductory call</span>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-accent-mint hover:bg-soft-mint text-theme-dark font-bold text-lg transition-all shadow-[0_0_30px_rgba(51,214,159,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? "Sending Request..." : (
                                    <>
                                        Submit Request
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
