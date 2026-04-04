"use client";

import { motion } from "framer-motion";
import { FileText, Gavel, Scaling, ShieldOff, ChevronRight } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TermsAndConditions() {
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
                        <Gavel className="w-3.5 h-3.5" />
                        Usage Terms
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Terms & <span className="text-accent-mint text-italic font-black">Conditions</span>
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                        Last updated: April 4, 2026. These terms govern your use of the Data Gather platform and any applications built through our services.
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
                            By accessing or using <strong>Data Gather</strong>, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and others who access or use the service.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Scaling className="w-6 h-6 text-accent-mint" />
                            2. Account Responsibilities
                        </h2>
                        <p className="mb-4">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-accent-mint">
                            <li><strong>Security:</strong> You are responsible for safeguarding the password that you use to access the service.</li>
                            <li><strong>Unauthorized Use:</strong> You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                            <li><strong>Compliance:</strong> You agree not to use the platform for any illegal or unauthorized purpose.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <ShieldOff className="w-6 h-6 text-accent-mint" />
                            3. Applications Built with Data Gather
                        </h2>
                        <p className="mb-4">
                            <strong>Data Gather</strong> is a powerful ecosystem for building high-performance web and mobile applications. When using our builder/platform:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 marker:text-accent-mint">
                            <li><strong>Ownership:</strong> You retain ownership of the content and data within the applications you create.</li>
                            <li><strong>Platform License:</strong> We grant you a limited, non-exclusive license to use the Data Gather builder technologies to deploy your apps.</li>
                            <li><strong>Compliance:</strong> Any mobile app (Android/iOS) or web app deployed via our platform must comply with the respective store policies and our acceptable use policy.</li>
                        </ul>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Scaling className="w-6 h-6 text-accent-mint" />
                            4. Intellectual Property
                        </h2>
                        <p>
                            The service and its original content (excluding content provided by users) are and will remain the exclusive property of <strong>Data Gather</strong> and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of <strong>Ahmed Fayyaz</strong>.
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
                            In no event shall Data Gather, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="p-8 rounded-2xl bg-white/5 border border-white/10"
                    >
                        <h2 className="text-xl font-bold text-white mb-4 font-black italic">Termination</h2>
                        <p className="text-sm mb-4">
                            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                        <p className="text-sm">
                            If you wish to terminate your account voluntarily, please visit:
                            <br />
                            <Link 
                                href="/delete-account"
                                className="text-accent-mint font-bold mt-2 inline-flex items-center gap-1 hover:underline"
                            >
                                Account Deletion Request
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </p>
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
