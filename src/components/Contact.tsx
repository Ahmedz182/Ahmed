"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Linkedin, Github, Phone } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from 'sileo';

export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "contacts"), {
                ...formData,
                createdAt: serverTimestamp(),
                read: false
            });
            sileo.success({ description: "Message sent successfully!" });
            setFormData({ name: "", email: "", message: "" });
        } catch (error: any) {
            console.error("Error sending message:", error);
            const errorMessage = error.code === 'permission-denied'
                ? "Database access denied. Please check your Firestore rules."
                : "An error occurred while sending your message. Please try again later.";
            sileo.error({ description: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 md:gap-12 lg:gap-24 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Let's build something <span className="text-accent-mint">amazing</span>
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed mb-10">
                        Have a project in mind or just want to say hi? I'm currently open for new
                        opportunities and would love to hear from you.
                    </p>

                    <div className="space-y-6">
                        <a href="mailto:ahmedmughal3182@gmail.com" className="flex items-center text-text-secondary hover:text-white group transition-colors p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-mint/30 max-w-md">
                            <div className="w-12 h-12 flex items-center justify-center bg-deep-green rounded-full mr-4 group-hover:bg-accent-mint group-hover:text-theme-dark transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-text-muted font-medium mb-0.5">Email Me</span>
                                <span className="font-semibold tracking-wide">ahmedmughal3182@gmail.com</span>
                            </div>
                        </a>

                        <a href="tel:+923357035717" className="flex items-center text-text-secondary hover:text-white group transition-colors p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-mint/30 max-w-md">
                            <div className="w-12 h-12 flex items-center justify-center bg-deep-green rounded-full mr-4 group-hover:bg-accent-mint group-hover:text-theme-dark transition-colors">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-text-muted font-medium mb-0.5">Call Me</span>
                                <span className="font-semibold tracking-wide">+92 335 7035717</span>
                            </div>
                        </a>

                        <div className="flex gap-4 pt-4">
                            <a href="https://linkedin.com/in/ahmedz182" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-accent-mint/50 hover:bg-white/10 text-white transition-all hover:-translate-y-1">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/ahmedz182" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-accent-mint/50 hover:bg-white/10 text-white transition-all hover:-translate-y-1">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-text-secondary">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                required
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                required
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-text-secondary">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell me about your project..."
                                className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent-mint text-theme-dark font-bold text-lg transition-all hover:bg-soft-mint shadow-[0_0_20px_rgba(51,214,159,0.2)] hover:shadow-[0_0_30px_rgba(51,214,159,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                "Sending..."
                            ) : (
                                <>
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
