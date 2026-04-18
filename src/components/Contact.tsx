"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Linkedin, Github, Phone } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from 'sileo';

const EASE = [0.22, 1, 0.36, 1] as const;

const fieldVariants = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE },
    }),
};

const contactItemVariants = {
    hidden: { opacity: 0, x: -24 },
    show: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, delay: 0.15 + i * 0.09, ease: EASE },
    }),
};

export const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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

            // Trigger Email Notification
            fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: 'contact', 
                    data: { ...formData, subject: 'New Portfolio Lead' } 
                })
            }).catch(e => console.error("Email notification failed:", e));

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
        <section id="contact" className="w-full py-10 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
            <div className="grid md:grid-cols-2 gap-16 md:gap-12 lg:gap-24 items-start">
                {/* Left column */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Let's build something <span className="text-accent-mint">amazing</span>
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed mb-10">
                        Have a project in mind or just want to say hi? I'm currently open for new
                        opportunities and would love to hear from you.
                    </p>

                    <div className="space-y-6">
                        {[
                            {
                                href: "mailto:ahmedmughal3182@gmail.com",
                                icon: <Mail className="w-5 h-5" />,
                                label: "Email Me",
                                value: "ahmedmughal3182@gmail.com",
                            },
                            {
                                href: "tel:+923357035717",
                                icon: <Phone className="w-5 h-5" />,
                                label: "Call Me",
                                value: "+92 335 7035717",
                            },
                        ].map((item, i) => (
                            <motion.a
                                key={item.label}
                                custom={i}
                                variants={contactItemVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-40px" }}
                                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                href={item.href}
                                className="flex items-center text-text-secondary hover:text-white group transition-colors p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent-mint/30 max-w-md"
                            >
                                <div className="w-12 h-12 flex items-center justify-center bg-deep-green rounded-full mr-4 group-hover:bg-accent-mint group-hover:text-theme-dark transition-colors">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-text-muted font-medium mb-0.5">{item.label}</span>
                                    <span className="font-semibold tracking-wide">{item.value}</span>
                                </div>
                            </motion.a>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.45, delay: 0.35, ease: EASE }}
                            className="flex gap-4 pt-4"
                        >
                            {[
                                { href: "https://linkedin.com/in/ahmedz182", icon: <Linkedin className="w-5 h-5" /> },
                                { href: "https://github.com/ahmedz182", icon: <Github className="w-5 h-5" /> },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-accent-mint/50 hover:bg-white/10 text-white transition-colors"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right — form */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {[
                            { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                            { id: "email", label: "Email Address", type: "email", placeholder: "john@example.com" },
                        ].map((field, i) => (
                            <motion.div
                                key={field.id}
                                custom={i}
                                variants={fieldVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-20px" }}
                                className="space-y-2"
                            >
                                <label htmlFor={field.id} className="text-sm font-medium text-text-secondary">{field.label}</label>
                                <input
                                    id={field.id}
                                    name={field.id}
                                    required
                                    type={field.type}
                                    value={formData[field.id as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 focus:border-transparent transition-all"
                                />
                            </motion.div>
                        ))}

                        <motion.div
                            custom={2}
                            variants={fieldVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-20px" }}
                            className="space-y-2"
                        >
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
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: 0.42, ease: EASE }}
                            className="w-full group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent-mint text-theme-dark font-bold text-lg transition-all hover:bg-soft-mint shadow-[0_0_20px_rgba(51,214,159,0.2)] hover:shadow-[0_0_30px_rgba(51,214,159,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Sending..." : (
                                <>
                                    Send Message
                                    <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
