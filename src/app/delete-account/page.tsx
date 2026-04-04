"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2, ShieldAlert, AlertCircle } from "lucide-react";
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

export default function DeleteAccount() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", reason: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "deletion_requests"), {
                ...formData,
                type: "account_deletion",
                createdAt: serverTimestamp(),
                read: false
            });
            sileo.success({ description: "Deletion request submitted successfully. We will contact you shortly." });
            setFormData({ name: "", email: "", reason: "" });
        } catch (error: any) {
            console.error("Error submitting deletion request:", error);
            sileo.error({ description: "An error occurred. Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-theme-dark text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold uppercase tracking-widest mb-6 mx-auto">
                        <Trash2 className="w-4 h-4" />
                        Account Security
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6">
                        Request Account <span className="text-red-500 italic">Deletion</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        We're sorry to see you go. Please fill out the form below to request the permanent deletion of your Data Gather account and all associated data.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Information Sidebar */}
                    <div className="md:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-accent-mint" />
                                What happens next?
                            </h3>
                            <ul className="space-y-3 text-sm text-text-secondary">
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    Your personal data will be permanently removed.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    All apps built with Data Gather will be deactivated.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    Subscription services (if any) will be cancelled.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    This action cannot be undone once processed.
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl bg-accent-mint/5 border border-accent-mint/10"
                        >
                            <h3 className="text-lg font-bold text-accent-mint mb-2 flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5" />
                                Security Check
                            </h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Our team will verify your identity via the registered email address before completing the deletion process. This typically takes 24-48 hours.
                            </p>
                        </motion.div>
                    </div>

                    {/* Request Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {[
                                { id: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                                { id: "email", label: "Registered Email Address", type: "email", placeholder: "john@example.com" },
                            ].map((field, i) => (
                                <motion.div
                                    key={field.id}
                                    custom={i}
                                    variants={fieldVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
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
                                        className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                                    />
                                </motion.div>
                            ))}

                            <motion.div
                                custom={2}
                                variants={fieldVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="space-y-2"
                            >
                                <label htmlFor="reason" className="text-sm font-medium text-text-secondary">Reason for Deletion (Optional)</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    rows={4}
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Tell us why you want to leave..."
                                    className="w-full px-4 py-3 rounded-lg bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all resize-none"
                                />
                            </motion.div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500 text-white font-bold text-lg transition-all hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting..." : (
                                    <>
                                        Submit Deletion Request
                                        <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
