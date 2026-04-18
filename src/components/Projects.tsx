"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { SafeImage } from "./SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProjectData {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    liveDemo?: string;
    github?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export const Projects = () => {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "projects"),
            where("isActive", "==", true),
            orderBy("createdAt", "desc"),
            limit(9)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ProjectData));
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <section id="projects" className="relative w-full py-20 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20 overflow-hidden">

            {/* Section grid lines */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(51,214,159,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(51,214,159,0.07) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                }}
            />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(51,214,159,0.04) 0%, transparent 70%)' }}
            />

            <div className="relative z-10 space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="text-center md:text-left"
                    >
                        <div className="inline-flex items-center gap-2 mb-3">
                            <span className="h-px w-6 bg-accent-mint" />
                            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-accent-mint">
                                Selected Work
                            </span>
                            <span className="h-px w-6 bg-accent-mint" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                            Featured <span className="text-accent-mint">Projects</span>
                        </h2>
                        <p className="mt-3 text-text-secondary/60 max-w-lg text-sm mx-auto md:mx-0">
                            A selection of my recent work on scalable architecture and engaging UIs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
                    >
                        <Link
                            href="/projects"
                            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-accent-mint/10 text-white border border-white/10 hover:border-accent-mint/50 transition-all duration-300 font-black uppercase tracking-widest text-[9px]"
                        >
                            View All
                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading && projects.length === 0 ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-[360px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        projects.map((proj, idx) => (
                            <ProjectCard
                                key={proj.id}
                                proj={proj}
                                idx={idx}
                                onClick={() => router.push(`/projects/${proj.id}`)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

function ProjectCard({ proj, idx, onClick }: { proj: ProjectData; idx: number; onClick: () => void }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

    // Spring-based tilt
    const rawX = useSpring(0, { stiffness: 300, damping: 30 });
    const rawY = useSpring(0, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(rawY, [-0.5, 0.5], [6, -6]);
    const rotateY = useTransform(rawX, [-0.5, 0.5], [-6, 6]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        rawX.set(x - 0.5);
        rawY.set(y - 0.5);
        setSpotlight({ x: x * 100, y: y * 100, opacity: 1 });
    };

    const handleMouseLeave = () => {
        rawX.set(0);
        rawY.set(0);
        setSpotlight(s => ({ ...s, opacity: 0 }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: Math.min(idx * 0.08, 0.25), ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
            whileHover={{ z: 10 }}
        >
            {/* Glassmorphism base */}
            <div className="absolute inset-0 rounded-2xl"
                style={{
                    background: 'linear-gradient(145deg, rgba(11,61,46,0.22) 0%, rgba(7,30,47,0.65) 100%)',
                    border: '1px solid rgba(51,214,159,0.1)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(51,214,159,0.07)',
                }}
            />

            {/* Inner grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0 rounded-2xl overflow-hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(51,214,159,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(51,214,159,0.04) 1px, transparent 1px)
                    `,
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Cursor spotlight */}
            <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden transition-opacity duration-300"
                style={{
                    opacity: spotlight.opacity,
                    background: `radial-gradient(200px circle at ${spotlight.x}% ${spotlight.y}%, rgba(51,214,159,0.09) 0%, transparent 70%)`,
                }}
            />

            {/* Top accent line (hover) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-mint/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-20" />

            {/* Number badge */}
            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-accent-mint/50 border border-transparent group-hover:border-accent-mint/15 transition-all duration-300">
                {String(idx + 1).padStart(2, '0')}
            </div>

            {/* Image */}
            <div className="relative w-full aspect-[16/8] overflow-hidden z-10 rounded-t-2xl">
                <SafeImage
                    src={proj.image}
                    alt={proj.title}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-85 group-hover:scale-105 transition-all duration-600 ease-out"
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071E2F] via-[#071E2F]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-deep-green/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Action buttons — slide up on hover */}
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    {proj.github && (
                        <a
                            href={proj.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/15 hover:bg-accent-mint hover:border-accent-mint hover:text-theme-dark text-white transition-all duration-200 text-[9px] font-black uppercase tracking-wider"
                        >
                            <Github className="w-2.5 h-2.5" /> Code
                        </a>
                    )}
                    {proj.liveDemo && (
                        <a
                            href={proj.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent-mint/85 backdrop-blur-sm border border-accent-mint/80 text-theme-dark hover:bg-accent-mint transition-all duration-200 text-[9px] font-black uppercase tracking-wider"
                        >
                            <ExternalLink className="w-2.5 h-2.5" /> Live
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-5 py-4 flex flex-col flex-1">

                {/* Title + arrow */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-black uppercase tracking-tight group-hover:text-accent-mint transition-colors duration-300 leading-tight">
                        {proj.title}
                    </h3>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-accent-mint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 mt-0.5" />
                </div>

                {/* Animated divider */}
                <div className="h-px mb-3 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-accent-mint/15 via-white/5 to-transparent group-hover:from-accent-mint/35 transition-all duration-500" />
                </div>

                {/* Description */}
                <p className="text-text-secondary/45 text-[11px] leading-relaxed mb-4 group-hover:text-text-secondary/65 transition-colors duration-300 flex-1 line-clamp-2">
                    {proj.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1">
                    {proj.techStack.slice(0, 5).map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded bg-white/[0.03] border border-white/[0.06] text-white/30 group-hover:border-accent-mint/20 group-hover:text-accent-mint/60 group-hover:bg-accent-mint/[0.05] transition-all duration-300"
                        >
                            {tech}
                        </span>
                    ))}
                    {proj.techStack.length > 5 && (
                        <span className="px-2 py-0.5 text-[8px] font-black rounded bg-white/[0.03] border border-white/[0.06] text-white/20">
                            +{proj.techStack.length - 5}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom glow sweep */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-mint/25 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-600 z-20" />

            {/* Edge glow (hover border) */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-0"
                style={{ boxShadow: '0 0 0 1px rgba(51,214,159,0.2), 0 8px 32px rgba(0,0,0,0.4)' }}
            />
        </motion.div>
    );
}
