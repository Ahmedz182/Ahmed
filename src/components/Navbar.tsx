"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (pathname === "/") {
            const hash = href.replace('/', '');
            const element = document.querySelector(hash);
            if (element) {
                // Because Lenis hooks into native scroll, scrollIntoView works smoothly
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
            }
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { name: "About", href: "/#about" },
        { name: "Skills", href: "/#skills" },
        { name: "Projects", href: "/#projects" },
        { name: "Experience", href: "/#experience" },
        { name: "Blog", href: "/#blog" },
        { name: "Let's Talk", href: "/#contact" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "pt-4 px-4 md:px-8" : "pt-0 px-0"
                }`}
        >
            <nav
                className={`mx-auto max-w-7xl transition-all duration-300 flex items-center justify-between relative ${isScrolled
                    ? "bg-theme-dark/90 backdrop-blur-md py-3 px-6 md:px-8 rounded-full border border-white/5 shadow-2xl"
                    : "bg-transparent py-5 px-6 md:px-12"
                    }`}
            >
                <Link
                    href="/"
                    onClick={(e) => {
                        if (pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    className="text-2xl font-bold tracking-tighter group text-white hover:text-accent-mint transition-colors"
                >
                    AHMED <span className="text-accent-mint group-hover:text-white transition-colors">FAYYAZ</span> .
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="text-sm font-medium text-text-secondary hover:text-accent-mint transition-colors cursor-pointer"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href="/hire"
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent-mint hover:bg-soft-mint text-theme-dark font-bold border border-transparent hover:border-accent-mint transition-all text-sm shadow-[0_0_15px_rgba(51,214,159,0.3)] cursor-pointer"
                    >
                        <Briefcase className="w-4 h-4" />
                        Hire Me
                    </Link>
                </div>

                {/* Mobile Nav Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Nav Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`md:hidden absolute left-0 w-full bg-theme-dark/95 backdrop-blur-xl border border-white/10 py-4 px-6 flex flex-col space-y-4 shadow-xl z-[-1] ${isScrolled ? "top-[calc(100%+12px)] rounded-2xl" : "top-full border-t-0 rounded-b-2xl"
                            }`}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="text-lg font-medium text-text-secondary hover:text-accent-mint cursor-pointer"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/hire"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-lg font-bold text-accent-mint hover:text-soft-mint cursor-pointer mt-2"
                        >
                            <Briefcase className="w-5 h-5" />
                            Hire Me
                        </Link>
                    </motion.div>
                )}
            </nav>
        </header>
    );
};
