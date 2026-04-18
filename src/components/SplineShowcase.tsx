"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const SplineScene = dynamic(
    () => import("@/components/3d/SplineScene").then((m) => m.SplineScene),
    { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

export const SplineShowcase = () => {
    return (
        <section className="relative w-full py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">

            {/* Section grid lines */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(51,214,159,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(51,214,159,0.07) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)',
                }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                {/* Left — text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="lg:w-2/5 space-y-6"
                >
                    <div className="inline-flex items-center gap-2">
                        <span className="h-px w-6 bg-accent-mint" />
                        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-accent-mint">
                            Interactive 3D
                        </span>
                        <span className="h-px w-6 bg-accent-mint" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                        Crafting{" "}
                        <span className="text-accent-mint">Immersive</span>
                        <br />
                        Experiences
                    </h2>

                    <p className="text-text-secondary/60 text-sm leading-relaxed max-w-sm">
                        Modern web development goes beyond flat screens. I bring depth,
                        motion and interactivity together — blending 3D visuals with
                        high-performance frontend code.
                    </p>

                    {/* Stat pills */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        {[
                            { label: "Three.js", sub: "WebGL" },
                            { label: "Spline", sub: "3D Design" },
                            { label: "Framer", sub: "Motion" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="px-4 py-2 rounded-xl border border-accent-mint/15 bg-accent-mint/[0.04] backdrop-blur-sm"
                            >
                                <div className="text-xs font-black text-white uppercase tracking-wider">{item.label}</div>
                                <div className="text-[9px] text-accent-mint/60 uppercase tracking-widest">{item.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative corner brackets */}
                    <div className="relative w-16 h-16 mt-4 opacity-20">
                        <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-mint" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-mint" />
                    </div>
                </motion.div>

                {/* Right — Spline canvas */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.93 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                    className="lg:w-3/5 w-full relative"
                >
                    {/* Outer glow */}
                    <div className="absolute -inset-6 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(51,214,159,0.07) 0%, transparent 70%)',
                            filter: 'blur(24px)',
                        }}
                    />

                    {/* Card frame */}
                    <div
                        className="relative rounded-3xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(145deg, rgba(11,61,46,0.2) 0%, rgba(7,30,47,0.55) 100%)',
                            border: '1px solid rgba(51,214,159,0.12)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(51,214,159,0.08)',
                        }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-mint/50 to-transparent z-10" />

                        {/* Inner grid */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(51,214,159,0.04) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(51,214,159,0.04) 1px, transparent 1px)
                                `,
                                backgroundSize: '32px 32px',
                            }}
                        />

                        <SplineScene
                            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                            className="w-full h-[420px] md:h-[500px]"
                        />

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-mint/30 to-transparent z-10" />
                    </div>

                    {/* Corner labels */}
                    <div className="absolute top-3 left-4 z-20 text-[8px] font-black uppercase tracking-[0.3em] text-accent-mint/30">
                        3D / Interactive
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
