"use client";

import { motion } from "framer-motion";
import {
    Code2,
    Github,
    Layout,
    Zap,
    Globe,
    Cpu,
    Music,
    Coffee,
    CheckCircle2,
    Terminal
} from "lucide-react";
import { SiJavascript, SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiFirebase } from "react-icons/si";

const BentoItem = ({
    children,
    className = "",
    title,
    subtitle,
    icon: Icon,
    delay = 0
}: {
    children?: React.ReactNode,
    className?: string,
    title?: string,
    subtitle?: string,
    icon?: any,
    delay?: number
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`relative group bg-theme-dark/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden p-6 hover:border-accent-mint/30 transition-colors duration-300 ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-mint/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 h-full flex flex-col">
            {Icon && (
                <div className="mb-4 p-3 bg-accent-mint/10 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-accent-mint" />
                </div>
            )}
            {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
            {subtitle && <p className="text-sm text-text-muted mb-4">{subtitle}</p>}
            <div className="flex-grow">
                {children}
            </div>
        </div>
    </motion.div>
);

export const BentoGrid = () => {
    return (
        <section id="ecosystem" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden relative">
            {/* Decorative accent behind grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-mint/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 mb-4"
                >
                    <div className="h-[1px] w-8 bg-accent-mint/50" />
                    <span className="text-accent-mint font-mono text-xs tracking-widest uppercase">
                        Productivity & Impact
                    </span>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-white leading-tight"
                >
                    The <span className="text-accent-mint italic">Technical</span> Ecosystem
                </motion.h2>
                <p className="text-text-muted mt-4 max-w-xl text-lg">
                    A bird's eye view of my capabilities, philosophy, and the tools I use to bring ideas to life.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[750px]">
                {/* Main Card - Fullstack */}
                <BentoItem
                    title="Fullstack Engineering"
                    subtitle="End-to-end Architecture"
                    icon={Code2}
                    className="md:col-span-2 md:row-span-2"
                    delay={0.1}
                >
                    <div className="mt-4 flex flex-col h-full">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-mint/20 transition-colors group/card">
                                <div className="text-accent-mint text-[9px] uppercase font-bold mb-1">Frontend Layer</div>
                                <div className="text-white text-xs font-medium mb-2">React, Next.js, Framer</div>
                                <div className="space-y-1">
                                    {['SSR & ISR', 'State Management', 'Dynamic Imports'].map((t, i) => (
                                        <div key={i} className="text-[8px] text-text-muted flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-accent-mint/40" /> {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-mint/20 transition-colors group/card">
                                <div className="text-accent-mint text-[9px] uppercase font-bold mb-1">Backend Infrastructure</div>
                                <div className="text-white text-xs font-medium mb-2">Node.js, Firebase, SQL</div>
                                <div className="space-y-1">
                                    {['REST & GraphQL', 'Auth Systems', 'Cloud Functions'].map((t, i) => (
                                        <div key={i} className="text-[8px] text-text-muted flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-accent-mint/40" /> {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-text-secondary text-[13px] leading-relaxed mb-4">
                            Building resilient systems that span the entire stack. I focus on bridging the gap between high-performance backends and delightful frontend experiences through clean, type-safe architecture.
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto pb-2">
                            {[SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiFirebase, SiJavascript].map((Icon, i) => (
                                <div key={i} className="p-2 bg-white/5 rounded-lg text-text-muted group-hover:text-accent-mint transition-all border border-white/5 hover:scale-105">
                                    <Icon className="text-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoItem>

                {/* GitHub Card */}
                <BentoItem
                    title="Open Source"
                    subtitle="Active contributions"
                    icon={Github}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.2}
                >
                    <div className="flex flex-col h-full justify-center pt-1">
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 21 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-full aspect-square rounded-[2px] transition-colors duration-500 ${i % 3 === 0 ? 'bg-accent-mint/60' :
                                        i % 4 === 0 ? 'bg-accent-mint/20' :
                                            'bg-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-text-muted mt-3 font-mono">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-white/5" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-accent-mint/20" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-accent-mint/40" />
                                <div className="w-1.5 h-1.5 rounded-[1px] bg-accent-mint/60" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </BentoItem>

                {/* User Centric */}
                <BentoItem
                    title="User Centric"
                    subtitle="Design Philosophy"
                    icon={Layout}
                    className="md:col-span-1 md:row-span-2"
                    delay={0.3}
                >
                    <div className="mt-2 flex flex-col justify-between h-full">
                        <div className="space-y-4 pt-2">
                            <p className="text-[12px] text-text-muted italic leading-relaxed">
                                "Design is not just what it looks like, but how it works and feels in the user's hands."
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Accessibility First', desc: 'WCAG Compliant components' },
                                    { label: 'Motion for Purpose', desc: 'Deliberate micro-interactions' },
                                    { label: 'Intuitive UX', desc: 'Predictable navigation patterns' },
                                    { label: 'Pixel Perfection', desc: 'Meticulous layout consistency' }
                                ].map((item, i) => (
                                    <div key={i} className="group/item">
                                        <div className="flex items-center gap-2.5 text-xs text-white font-medium mb-1">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint" />
                                            {item.label}
                                        </div>
                                        <div className="text-[10px] text-text-muted pl-6">{item.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative mt-auto pt-6 group/progress">
                            <div className="flex justify-between mb-2">
                                <span className="text-[9px] text-text-muted uppercase tracking-wider font-bold">Standard of Excellence</span>
                                <span className="text-[9px] text-accent-mint font-mono">95%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent-mint shadow-[0_0_8px_rgba(51,214,159,0.5)]"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "95%" }}
                                    transition={{ duration: 1.5, delay: 0.8 }}
                                />
                            </div>
                        </div>
                    </div>
                </BentoItem>

                {/* Performance Card */}
                <BentoItem
                    title="Optimization"
                    subtitle="Core Web Vitals"
                    icon={Zap}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.4}
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-3xl font-black text-white leading-none">99<span className="text-accent-mint/50 ml-1 font-mono text-sm">SCORE</span></div>
                        <div className="flex gap-3 mt-4 w-full justify-between items-center px-1">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] text-text-muted">LCP</span>
                                <span className="text-[9px] text-accent-mint font-bold">0.8s</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] text-text-muted">SEO</span>
                                <span className="text-[9px] text-accent-mint font-bold">100</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] text-text-muted">FID</span>
                                <span className="text-[9px] text-accent-mint font-bold">12ms</span>
                            </div>
                        </div>
                    </div>
                </BentoItem>

                {/* Global Reach */}
                <BentoItem
                    title="Availability"
                    subtitle="Collaboration"
                    icon={Globe}
                    className="md:col-span-2 md:row-span-1"
                    delay={0.5}
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between h-full pt-1 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                                <span className="text-[11px] text-white">Active Now: GMT+5</span>
                            </div>
                            <p className="text-[10px] text-text-muted leading-tight max-w-[220px]">
                                Fluent in English & Urdu. Experienced in asynchronous workflows and remote cultures.
                            </p>
                        </div>
                        <div className="flex -space-x-2 pb-1">
                            {['AZ', 'BK', 'SM', 'RJ'].map((initials, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-theme-dark bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    {initials}
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-theme-dark bg-accent-mint/20 text-accent-mint flex items-center justify-center text-[10px] font-bold shadow-lg">
                                +12
                            </div>
                        </div>
                    </div>
                </BentoItem>

                {/* Terminal/Code Card */}
                <BentoItem
                    className="md:col-span-1 md:row-span-1 border-white/10 bg-black/60 shadow-2xl"
                    delay={0.6}
                >
                    <div className="font-mono text-[10px] text-accent-mint/80 space-y-1 h-full flex flex-col justify-center">
                        <div className="text-white/40 mb-2 flex items-center gap-1.5">
                            <Terminal className="w-3 h-3" /> developer.json
                        </div>
                        <div>{"{"}</div>
                        <div className="pl-3">"role": <span className="text-white">"Fullstack"</span>,</div>
                        <div className="pl-3">"uptime": <span className="text-white">"99.9%"</span>,</div>
                        <div className="pl-3">"coffee": <span className="text-white">"Running"</span></div>
                        <div>{"}"}</div>
                    </div>
                </BentoItem>

                {/* NEW CARD: Problem Solver */}
                <BentoItem
                    title="Mindset"
                    subtitle="Problem Solving"
                    icon={Cpu}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.7}
                >
                    <div className="mt-1 flex flex-col justify-center h-full">
                        <div className="text-[9px] text-text-muted mb-1 font-mono italic">Complexity:</div>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-black text-white uppercase leading-none">O(1)</span>
                            <span className="text-[9px] text-accent-mint font-bold italic">OPTIMIZED</span>
                        </div>
                    </div>
                </BentoItem>
            </div>
        </section>
    );
};
