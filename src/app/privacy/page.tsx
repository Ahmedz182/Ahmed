"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PrivacyPolicy() {
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
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Legal Information
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Privacy <span className="text-accent-mint text-italic font-black">Policy</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                        Last updated: April 4, 2026. This policy explains how Data Gather collects, uses, and protects your information across our web and mobile applications.
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
                            <Lock className="w-6 h-6 text-accent-mint" />
                            1. Information Collection
                        </h2>
                        <p className="mb-4">
                            At <strong>Data Gather</strong>, we collect information to provide a better experience for our users. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-accent-mint">
                            <li><strong>Account Information:</strong> Name, email address, and profile details when you create an account.</li>
                            <li><strong>App Data:</strong> Information related to the web and mobile applications you build using our platform.</li>
                            <li><strong>Usage Data:</strong> Metadata about how you interact with our services, including IP addresses and device information.</li>
                            <li><strong>Consent Data:</strong> Records of consents provided for data processing and marketing communications.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-accent-mint" />
                            2. App Building & Data Consent
                        </h2>
                        <p className="mb-4">
                            When you use <strong>Data Gather</strong> to build web or mobile applications, you act as the data controller for the information collected through those apps.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-accent-mint font-bold mb-2">User Consent</h4>
                                <p className="text-sm">We provide tools to help you manage consent from your end-users. You are responsible for ensuring that your apps comply with local privacy laws.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-accent-mint font-bold mb-2">Data Processing</h4>
                                <p className="text-sm">We process data gathered by your applications solely to provide the services requested and maintain the application's functionality.</p>
                            </div>
                        </div>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Eye className="w-6 h-6 text-accent-mint" />
                            3. How We Use Your Data
                        </h2>
                        <p className="mb-4">
                            We use the collected data for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-accent-mint">
                            <li>To operate and maintain the Data Gather platform.</li>
                            <li>To facilitate the creation and management of user-built applications.</li>
                            <li>To provide customer support and respond to your requests.</li>
                            <li>To enhance security and prevent fraudulent activities.</li>
                            <li>To comply with legal obligations and enforce our terms.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <FileText className="w-6 h-6 text-accent-mint" />
                            3. Data Sharing & Third Parties
                        </h2>
                        <p>
                            We do not sell your personal data. We may share information with trusted service providers who assist us in operating our platform, such as cloud hosting services (e.g., Firebase, Vercel) or analytics providers. All third parties are required to maintain the confidentiality and security of your data.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights & Choices</h2>
                        <p className="mb-4">
                            You have the right to access, update, or delete your personal information. If you wish to delete your account and all associated data, please visit our dedicated deletion request page:
                        </p>
                        <Link 
                            href="/delete-account"
                            className="inline-flex items-center gap-2 text-accent-mint font-bold hover:underline group"
                        >
                            Request Account Deletion
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="p-8 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-sm">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            <a href="mailto:ahmedmughal3182@gmail.com" className="text-accent-mint font-bold mt-2 inline-block">ahmedmughal3182@gmail.com</a>
                        </p>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
