"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Github, ExternalLink, Search, Filter, Layout } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { useRouter } from "next/navigation";

interface ProjectData {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    liveDemo?: string;
    github?: string;
}

export default function ProjectsListPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "projects"),
            where("isActive", "==", true),
            orderBy("createdAt", "desc")
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

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-theme-dark text-white selection:bg-accent-mint/30">
            {/* Background pattern */}
            <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
                            Selected <span className="text-accent-mint">Works</span>
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl font-medium">
                            A complete archive of digital products, scalable architectures, and engineering experiments.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group w-full md:w-96"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-mint transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects or technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-4 pl-14 pr-6 text-sm outline-none focus:border-accent-mint/30 focus:bg-white/[0.05] transition-all duration-300"
                        />
                    </motion.div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {filteredProjects.map((proj, idx) => (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.8 }}
                                onClick={() => router.push(`/projects/${proj.id}`)}
                                className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-accent-mint/30 transition-all duration-500 cursor-pointer mb-8"
                            >
                                {/* Numbering Overlay */}
                                <div className="absolute top-6 left-6 z-20 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-accent-mint transition-colors">
                                    Project / {idx < 9 ? `0${idx + 1}` : idx + 1}
                                </div>

                                {/* Image Container */}
                                <div className="relative w-full aspect-[16/9] overflow-hidden">
                                    <SafeImage
                                        src={proj.image}
                                        alt={proj.title}
                                        fill
                                        className="opacity-60 group-hover:opacity-100 group-hover:scale-110"
                                        unoptimized
                                    />

                                    {/* Inner Gradient Overlay */}
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

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-1 relative">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-accent-mint transition-colors text-center">
                                        {proj.title}
                                    </h3>

                                    <p className="text-text-secondary/60 text-sm leading-relaxed mb-6 block text-center">
                                        {proj.description}
                                    </p>

                                    {/* Tech Stack - Premium Tags */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {proj.techStack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md bg-white/[0.03] border border-white/10 text-white/40 group-hover:border-accent-mint/20 group-hover:text-accent-mint group-hover:bg-accent-mint/5 transition-all"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Hover Border Flare */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-mint/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] text-center px-6">
                        <Layout className="w-16 h-16 text-white/5 mb-6" />
                        <h3 className="text-white/40 text-xl font-black uppercase tracking-widest">No Projects Found</h3>
                        <p className="text-white/20 text-sm mt-4 max-w-sm">Try using different keywords or technologies to find matching projects.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
