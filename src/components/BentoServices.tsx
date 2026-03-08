"use client";

import { motion } from "framer-motion";
import {
    PencilRuler,
    Rocket,
    ShieldCheck,
    Cpu,
    Layers,
    Smartphone,
    ChevronRight,
    Sparkles
} from "lucide-react";

const BentoCard = ({
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
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`relative group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden p-8 hover:bg-white/[0.04] transition-all duration-500 ${className}`}
    >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            {Icon && <Icon className="w-12 h-12 text-accent-mint" />}
        </div>

        <div className="relative z-10 flex flex-col h-full">
            <div className="mb-auto">
                {title && <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>}
                {subtitle && <p className="text-sm text-text-muted mb-6">{subtitle}</p>}
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    </motion.div>
);

export const BentoServices = () => {
    return (
        <section id="services" className="w-full py-10 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-accent-mint" />
                        <span className="text-accent-mint font-mono text-xs tracking-widest uppercase text-left">
                            Specializations
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white text-left"
                    >
                        Tailored <span className="text-accent-mint">Solutions</span>
                    </motion.h2>
                </div>
                <p className="text-text-muted max-w-md text-sm md:text-base md:text-right">
                    Beyond standard engineering—delivering high-impact strategies and bespoke digital crafts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[650px]">
                {/* Web Excellence */}
                <BentoCard
                    title="Enterprise Web"
                    subtitle="Scalable Architecture"
                    icon={Rocket}
                    className="md:col-span-2 md:row-span-1"
                    delay={0.1}
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between mt-2">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {[
                                { label: 'Micro-frontends', desc: 'Modular scalability' },
                                { label: 'Headless CMS', desc: 'Content flexibility' },
                                { label: 'Next.js Clusters', desc: 'Edge optimized' },
                                { label: 'SEO Excellence', desc: 'Organic growth focus' }
                            ].map((t, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center gap-2 text-[13px] text-white font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(51,214,159,0.4)]" />
                                        {t.label}
                                    </div>
                                    <div className="text-[10px] text-text-muted pl-3.5 italic">{t.desc}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-accent-mint/10 text-accent-mint p-5 rounded-2xl border border-accent-mint/20 flex flex-col items-center justify-center min-w-[140px] group-hover:bg-accent-mint/20 transition-colors">
                            <span className="text-3xl font-black italic leading-none">99.9%</span>
                            <span className="text-[9px] uppercase tracking-widest mt-1 font-bold">UPTIME SLA</span>
                        </div>
                    </div>
                </BentoCard>

                {/* UI Architecture */}
                <BentoCard
                    title="Design Systems"
                    subtitle="Consistency at Scale"
                    icon={PencilRuler}
                    className="md:col-span-1 md:row-span-2"
                    delay={0.2}
                >
                    <div className="mt-4 space-y-5 h-full flex flex-col">
                        <p className="text-[12px] text-text-secondary leading-relaxed border-l-2 border-accent-mint/30 pl-4 py-1 italic">
                            "Crafting modular UI libraries that empower teams to build cohesive products faster while maintaining brand integrity."
                        </p>

                        {/* Design Tokens Preview */}
                        <div className="grid grid-cols-4 gap-2 py-4">
                            {[
                                'bg-accent-mint', 'bg-accent-mint/60', 'bg-accent-mint/30', 'bg-white/5',
                                'rounded-full', 'rounded-2xl', 'rounded-lg', 'rounded-sm'
                            ].map((style, i) => (
                                <div key={i} className={`h-8 w-full border border-white/5 flex items-center justify-center ${style.startsWith('bg') ? style : 'bg-white/10 ' + style}`}>
                                    {!style.startsWith('bg') && <div className="w-2 h-2 bg-accent-mint rounded-inherit" />}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3.5">
                            {[
                                { label: 'Branding & Identity', val: '80%' },
                                { label: 'Spacing & Layout', val: '100%' },
                                { label: 'Design Tokens', val: '90%' },
                                { label: 'Component Library', val: '85%' }
                            ].map((bar, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] text-white uppercase font-bold tracking-tight">
                                        <span>{bar.label}</span>
                                        <span className="text-accent-mint">{bar.val}</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-accent-mint/50"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: bar.val }}
                                            transition={{ duration: 1.2, delay: 0.5 + (i * 0.1) }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Design Tech Stack */}
                        <div className="mt-auto pt-6 flex justify-between items-center border-t border-white/5">
                            <div className="flex gap-3">
                                {['Figma', 'Storybook', 'Tailwind'].map((tool) => (
                                    <span key={tool} className="text-[9px] font-mono text-text-muted hover:text-accent-mint transition-colors cursor-default uppercase">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                            <div className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                        </div>
                    </div>
                </BentoCard>

                {/* Mobile */}
                <BentoCard
                    title="Mobile Dev"
                    subtitle="iOS & Android Solutions"
                    icon={Smartphone}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.3}
                >
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="flex flex-wrap gap-2">
                            {['React Native', 'Flutter', 'Fastlane'].map((tech) => (
                                <span key={tech} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-text-muted leading-snug">
                            High-performance mobile apps focusing on native-like feel and fluid animations.
                        </p>
                        <div className="group/btn flex items-center justify-between bg-accent-mint/5 border border-accent-mint/10 p-4 rounded-2xl hover:bg-accent-mint/10 hover:border-accent-mint/30 transition-all cursor-pointer mt-auto">
                            <span className="text-sm font-bold text-accent-mint">View Portfolio</span>
                            <ChevronRight className="w-4 h-4 text-accent-mint group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </BentoCard>

                {/* AI & Automation */}
                <BentoCard
                    title="AI Integration"
                    subtitle="Applied Intelligence"
                    icon={Cpu}
                    className="md:col-span-1 md:row-span-1"
                    delay={0.4}
                >
                    <div className="space-y-4 h-full flex flex-col mt-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                                <Layers className="w-3.5 h-3.5 text-accent-mint" />
                                RAG Architecture
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                                <ShieldCheck className="w-3.5 h-3.5 text-accent-mint" />
                                Prompt Engineering
                            </div>
                        </div>

                        <div className="flex gap-2 items-center mt-auto border-t border-white/5 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-accent-mint/10 border-2 border-theme-dark flex items-center justify-center shadow-lg">
                                        <span className="text-[10px] font-black text-accent-mint">GPT</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col ml-1">
                                <span className="text-[11px] font-bold text-white">Advanced Flow</span>
                                <span className="text-[9px] text-text-muted uppercase tracking-tighter">Automated Pipeline</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>
            </div>
        </section>
    );
};
