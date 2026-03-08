"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Github, Linkedin, Mail, Phone, Twitter, Instagram, ExternalLink } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export const Footer = () => {
    const [contactInfo, setContactInfo] = useState({
        email: "ahmedmughal3182@gmail.com",
        phone: "+92 335 7035717",
        github: "https://github.com/ahmedz182",
        linkedin: "https://linkedin.com/in/ahmedz182",
        twitter: "",
        instagram: ""
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "metadata", "settings");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.contact) {
                        setContactInfo({
                            email: data.contact.email || contactInfo.email,
                            phone: data.contact.phone || contactInfo.phone,
                            github: data.contact.github || contactInfo.github,
                            linkedin: data.contact.linkedin || contactInfo.linkedin,
                            twitter: data.contact.twitter || "",
                            instagram: data.contact.instagram || ""
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching footer settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const currentYear = new Date().getFullYear();

    const footerLinks = {
        navigation: [
            { name: "About", href: "#about" },
            { name: "Projects", href: "#projects" },
            { name: "Experience", href: "#experience" },
            { name: "Skills", href: "#skills" },
            { name: "Blog", href: "#blog" },
            { name: "Contact", href: "#contact" },
        ],
        services: [
            "UI/UX Design",
            "Web Development",
            "Mobile App Development",
            "Backend Systems",
            "Cloud Solutions",
        ],
        socials: [
            { icon: <Github className="w-5 h-5" />, href: contactInfo.github, name: "GitHub" },
            { icon: <Linkedin className="w-5 h-5" />, href: contactInfo.linkedin, name: "LinkedIn" },
            { icon: <Twitter className="w-5 h-5" />, href: contactInfo.twitter, name: "Twitter" },
            { icon: <Instagram className="w-5 h-5" />, href: contactInfo.instagram, name: "Instagram" },
        ]
    };

    return (
        <footer className="w-full border-t border-white/5 bg-theme-dark relative z-10 pt-20 pb-10 overflow-hidden text-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-mint/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-deep-green/10 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6">
                        <motion.a
                            href="#"
                            onClick={(e) => { e.preventDefault(); scrollToTop(); }}
                            className="inline-block hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Ahmed Fayyaz"
                                width={160}
                                height={54}
                                className="object-contain drop-shadow-[0_0_15px_rgba(51,214,159,0.3)]" />
                        </motion.a>
                        <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                            Crafting high-performance digital experiences with precision and passion. Building the future, one line of code at a time.
                        </p>
                        <div className="flex items-center gap-4">
                            {footerLinks.socials
                                .filter(social => social.href && social.href !== "#" && social.href.trim() !== "")
                                .map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-text-muted hover:text-accent-mint hover:border-accent-mint/50 hover:bg-accent-mint/5 transition-all"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider italic">Quick Navigation</h3>
                        <ul className="grid grid-cols-2 gap-3">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-text-muted hover:text-accent-mint transition-colors text-sm flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-mint/30 mr-2 group-hover:bg-accent-mint transition-colors" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services/Expertise */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider italic">Expertise</h3>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.services.map((service) => (
                                <li key={service} className="text-text-muted text-sm flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-deep-green/50 mr-2" />
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & CTA */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider italic">Get in Touch</h3>
                        <div className="space-y-4">
                            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-text-muted hover:text-white transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-accent-mint/10 group-hover:border-accent-mint/30 transition-all">
                                    <Mail className="w-4 h-4 text-accent-mint" />
                                </div>
                                <span className="text-sm truncate">{contactInfo.email}</span>
                            </a>
                            <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-text-muted hover:text-white transition-colors group">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-accent-mint/10 group-hover:border-accent-mint/30 transition-all">
                                    <Phone className="w-4 h-4 text-accent-mint" />
                                </div>
                                <span className="text-sm">{contactInfo.phone}</span>
                            </a>
                        </div>
                        <Link href="/hire">
                            <button

                                className="mt-2 px-6 py-3 rounded-xl bg-accent-mint text-theme-dark font-bold text-sm transition-all hover:bg-soft-mint shadow-[0_0_20px_rgba(51,214,159,0.2)] hover:shadow-[0_0_30px_rgba(51,214,159,0.4)] flex items-center justify-center gap-2 group w-fit hover:-translate-y-1"
                            >
                                Hire Me Now
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-text-muted text-xs font-semibold tracking-wide">
                        © {currentYear} Ahmed Fayyaz. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-2 text-text-muted hover:text-accent-mint transition-colors text-xs font-bold uppercase tracking-widest group"
                        >
                            Return to top
                            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>

                    <p className="text-text-muted text-xs font-semibold tracking-wide flex items-center">
                        Built with <span className="text-accent-mint mx-1 animate-pulse">💚</span> by Ahmed
                    </p>
                </div>
            </div>
        </footer>
    );
};
