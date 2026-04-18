"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectCard, type ProjectData } from "./ProjectCard";

const EASE = [0.22, 1, 0.36, 1] as const;

export const Projects = () => {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "projects"),
            orderBy("createdAt", "desc"),
            limit(18)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as ProjectData))
                .filter(p => p.isActive !== false)
                .slice(0, 9);
            setProjects(data);
            setLoading(false);
        }, (err) => {
            console.error("Projects fetch error:", err);
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
