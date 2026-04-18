"use client";

import { motion } from "framer-motion";
import { Scale, FileText, ShieldAlert, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-theme-dark text-white pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-mint/10 border border-accent-mint/20 text-accent-mint text-xs font-bold uppercase tracking-widest mb-6">
                        <Scale className="w-3.5 h-3.5" />
                        Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Terms of <span className="text-accent-mint text-italic font-black">Service</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                        Last updated: April 18, 2026. Please read these terms carefully before using our platform. By accessing our services, you agree to be bound by these terms.
                    </p>
                </motion.div>

                {/* Content */}
                <div className="space-y-12 text-text-secondary leading-relaxed">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-accent-mint" />
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using the services provided by this Portfolio Platform (the "Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-accent-mint" />
                            2. Use of Service
                        </h2>
                        <p className="mb-4">
                            You are responsible for your use of the Service and for any content you provide, including compliance with applicable laws, rules, and regulations.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-accent-mint">
                            <li>You must not use the Service for any illegal or unauthorized purpose.</li>
                            <li>You must not attempt to hack, destabilize, or adapt the Service.</li>
                            <li>You must not use the Service to distribute spam or malicious code.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-accent-mint" />
                            3. Intellectual Property
                        </h2>
                        <p>
                            All content, features, and functionality of the Service, including but not limited to text, graphics, logos, and code, are the exclusive property of the owner and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
                        <p>
                            In no event shall the Service or its owner be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Service.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="p-8 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Questions?</h2>
                        <p className="text-sm">
                            If you have any questions regarding these Terms, please contact us at:
                            <br />
                            <a href="mailto:ahmedmughal3182@gmail.com" className="text-accent-mint font-bold mt-2 inline-block">ahmedmughal3182@gmail.com</a>
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/5 flex gap-6">
                            <Link href="/privacy" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent-mint transition-colors">Privacy Policy</Link>
                            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-accent-mint transition-colors">Back to Home</Link>
                        </div>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
