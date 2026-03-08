"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProjectData {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    liveDemo: string;
    github: string;
}

export const Projects = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
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

    if (loading && projects.length === 0) return null;

    return (
        <section id="projects" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Featured <span className="text-accent-mint">Projects</span>
                    </h2>
                    <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg">
                        A selection of my recent work focusing on scalable architecture
                        and engaging user interfaces.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((proj, idx) => (
                        <motion.div
                            key={proj.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-accent-mint/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                        >
                            <div className="relative w-full aspect-video overflow-hidden bg-theme-dark">
                                <Image
                                    src={proj.image}
                                    alt={proj.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-theme-dark via-transparent to-transparent opacity-80" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-2xl font-bold mb-3">{proj.title}</h3>

                                <p className="text-text-muted text-sm flex-1 leading-relaxed mb-6 block min-h-[4rem]">
                                    {proj.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {proj.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-xs font-semibold rounded-full bg-deep-green/30 border border-deep-green/50 text-soft-mint"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                                    <a
                                        href={proj.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm font-medium text-text-secondary hover:text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4 mr-2" />
                                        Code
                                    </a>

                                    <a
                                        href={proj.liveDemo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-sm font-medium text-accent-mint hover:text-soft-mint transition-colors group/link"
                                    >
                                        Live Demo
                                        <ExternalLink className="w-4 h-4 ml-2 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
