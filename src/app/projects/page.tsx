"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Search, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectCard, type ProjectData } from "@/components/ProjectCard";


export default function ProjectsListPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = query(
            collection(db, "projects"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as ProjectData))
                .filter(p => p.isActive !== false);
            setProjects(data);
            setLoading(false);
        }, (err) => {
            console.error("Projects page fetch error:", err);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProjects.map((proj, idx) => (
                            <ProjectCard
                                key={proj.id}
                                proj={proj}
                                idx={idx}
                                onClick={() => router.push(`/projects/${proj.id}`)}
                            />
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
