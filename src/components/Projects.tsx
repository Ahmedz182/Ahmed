"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { SafeImage } from "./SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
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
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(9));
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
        <section id="projects" className="w-full py-10 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
            <div className="space-y-16">
                {/* Header row */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.65, ease: EASE }}
                        className="text-center md:text-left mb-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                            Featured <span className="text-accent-mint">Projects</span>
                        </h2>
                        <p className="mt-4 text-text-secondary max-w-2xl text-lg mx-auto md:mx-0">
                            A selection of my recent work focusing on scalable architecture
                            and engaging user interfaces.
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
                            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent-mint/30 transition-all font-black uppercase tracking-widest text-xs"
                        >
                            View All Projects
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {loading && projects.length === 0 ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-[450px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
                        ))
                    ) : (
                        projects.map((proj, idx) => (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{
                                    duration: 0.6,
                                    delay: Math.min(idx * 0.1, 0.3),
                                    ease: EASE,
                                }}
                                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                                onClick={() => router.push(`/projects/${proj.id}`)}
                                className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent-mint/30 transition-colors duration-500 cursor-pointer mb-8 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                            >
                                {/* Numbering Overlay */}
                                <div className="absolute top-6 left-6 z-20 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-accent-mint transition-colors duration-300">
                                    Project / 0{idx + 1}
                                </div>

                                {/* Image */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <SafeImage
                                        src={proj.image}
                                        alt={proj.title}
                                        fill
                                        className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-theme-dark via-transparent to-transparent opacity-60" />

                                    {/* Quick Links Hover Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {proj.github && (
                                            <a
                                                href={proj.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent-mint hover:text-theme-dark transition-all hover:scale-110 shadow-2xl"
                                            >
                                                <Github className="w-5 h-5 text-white" />
                                            </a>
                                        )}
                                        {proj.liveDemo && (
                                            <a
                                                href={proj.liveDemo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent-mint hover:text-theme-dark transition-all hover:scale-110 shadow-2xl"
                                            >
                                                <ExternalLink className="w-5 h-5 text-white" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-1 relative">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-accent-mint transition-colors text-center duration-300">
                                        {proj.title}
                                    </h3>

                                    <p className="text-text-secondary/60 text-sm leading-relaxed mb-6 block text-center">
                                        {proj.description}
                                    </p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {proj.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md bg-white/[0.03] border border-white/10 text-white/40 group-hover:border-accent-mint/20 group-hover:text-accent-mint group-hover:bg-accent-mint/5 transition-all duration-300"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Hover Border Flare */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-mint/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};
