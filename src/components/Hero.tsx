"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiJavascript, SiMongodb } from "react-icons/si";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

const HeroScene = dynamic(
    () => import("@/components/3d/HeroScene").then((m) => m.HeroScene),
    { ssr: false }
);

export const Hero = () => {
    const ring1Radius = 160;
    const ring2Radius = 90;

    const ring1Icons = [
        { icon: <FaReact className="w-6 h-6" />, angle: 0, delay: 0 },
        { icon: <SiNextdotjs className="w-6 h-6" />, angle: 60, delay: 0.2 },
        { icon: <SiTailwindcss className="w-6 h-6" />, angle: 120, delay: 0.4 },
        { icon: <SiJavascript className="w-6 h-6" />, angle: 180, delay: 0.6 },
        { icon: <FaNodeJs className="w-6 h-6" />, angle: 240, delay: 0.8 },
        { icon: <SiMongodb className="w-6 h-6" />, angle: 300, delay: 1.0 },
    ].map((item) => ({
        ...item,
        x: Math.cos((item.angle * Math.PI) / 180) * ring1Radius,
        y: Math.sin((item.angle * Math.PI) / 180) * ring1Radius,
    }));

    const ring2Icons = [
        { icon: <FaHtml5 className="w-5 h-5" />, angle: 30, delay: 0.3 },
        { icon: <FaCss3Alt className="w-5 h-5" />, angle: 150, delay: 0.7 },
        { icon: <FaGithub className="w-5 h-5" />, angle: 270, delay: 1.1 },
    ].map((item) => ({
        ...item,
        x: Math.cos((item.angle * Math.PI) / 180) * ring2Radius,
        y: Math.sin((item.angle * Math.PI) / 180) * ring2Radius,
    }));

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative w-full min-h-screen flex items-center pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            {/* ── 3D WebGL background ── */}
            <div className="absolute inset-0 z-0">
                <HeroScene />
            </div>

            {/* Soft ambient glow blobs (layered over 3D, under content) */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-mint/10 rounded-full blur-[128px] pointer-events-none z-[1]" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-deep-green/30 rounded-full blur-[96px] pointer-events-none z-[1]" />

            <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                {/* Left Text Content */}
                <div className="max-w-3xl space-y-8 lg:w-3/5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-accent-mint/20 text-accent-mint text-sm font-medium tracking-wide"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent-mint mr-2 animate-pulse" />
                        Software Engineer • Frontend Specialist
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]"
                    >
                        I'm <span className="text-accent-mint">Ahmed Fayyaz</span>.
                        <br />
                        Building scalable modern web applications with{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-mint to-soft-mint">
                            clean UI
                        </span>{" "}
                        and powerful architecture.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed"
                    >
                        Frontend focused developer experienced with React, Next.js, and modern
                        JavaScript ecosystems. Passionate about building performant, scalable,
                        and elegant user experiences.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.3 }}
                        className="flex flex-wrap items-center gap-4 pt-4"
                    >
                        <Link
                            href="/hire"
                            className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent-mint text-theme-dark font-bold transition-all hover:bg-soft-mint shadow-[0_0_20px_rgba(51,214,159,0.4)] hover:shadow-[0_0_30px_rgba(51,214,159,0.6)]"
                        >
                            <Briefcase className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            Hire Me
                        </Link>

                        <a
                            href="#projects"
                            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 text-white font-medium border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            View Projects
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <ResumeDownloadButton />
                    </motion.div>
                </div>

                {/* Right: existing icon rings + 3D canvas shows through behind them */}
                <div className="hidden md:flex w-full lg:w-2/5 justify-center items-center h-[400px] relative pointer-events-none">
                    {mounted && (
                        <div className="relative w-full h-full flex items-center justify-center scale-75 lg:scale-100">
                            {/* Rotating dashed rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[320px] h-[320px] rounded-full border border-white/10 border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[180px] h-[180px] rounded-full border border-white/5 border-dashed"
                            />

                            {/* Center React logo */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="absolute z-20 bg-theme-dark/90 p-6 rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(51,214,159,0.3)] backdrop-blur-md flex items-center justify-center text-accent-mint"
                            >
                                <FaReact className="w-12 h-12 animate-[spin_10s_linear_infinite]" />
                            </motion.div>

                            {/* Outer Ring Icons */}
                            {ring1Icons.map((item, i) => (
                                <motion.div
                                    key={`ring1-${i}`}
                                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                    animate={{ x: item.x, y: item.y, opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: item.delay, type: "spring" }}
                                    className="absolute z-10"
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                                        className="bg-theme-dark/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(51,214,159,0.15)] text-accent-mint"
                                    >
                                        {item.icon}
                                    </motion.div>
                                </motion.div>
                            ))}

                            {/* Inner Ring Icons */}
                            {ring2Icons.map((item, i) => (
                                <motion.div
                                    key={`ring2-${i}`}
                                    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                    animate={{ x: item.x, y: item.y, opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: item.delay, type: "spring" }}
                                    className="absolute z-0"
                                >
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                                        className="bg-theme-dark/60 backdrop-blur-sm p-3 rounded-xl border border-white/5 flex items-center justify-center text-white/70"
                                    >
                                        {item.icon}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
