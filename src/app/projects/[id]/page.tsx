"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, Globe, Layout, Code, Zap, Smartphone, Server } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SafeImage } from "@/components/SafeImage";

interface ProjectData {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    liveDemo: string;
    github: string;
    // Extra clinical details
    fullDescription?: string;
    architecture?: string;
    caseStudy?: string;
    challenges?: string;
    role?: string;
    timeline?: string;
    features?: string[];
}

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "projects", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() } as ProjectData);
                } else {
                    router.push("/#projects");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-theme-dark flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="min-h-screen bg-theme-dark text-white selection:bg-accent-mint/30 overflow-x-hidden">
            {/* Background pattern */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{
                background: 'radial-gradient(circle at 50% 0%, #0E5A45 0%, transparent 70%)'
            }} />

            <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-text-muted hover:text-accent-mint transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Projects</span>
                </motion.button>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left Column: Details */}
                    <div className="space-y-12">
                        <header>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-mint/10 border border-accent-mint/20 text-accent-mint text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                            >
                                <Layout className="w-3 h-3" />
                                <span>Featured Project</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                            >
                                {project.title}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-3"
                            >
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 rounded-xl bg-accent-mint/10 border border-accent-mint/20 text-[11px] font-black uppercase tracking-[0.2em] text-accent-mint hover:bg-accent-mint/20 transition-all duration-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </motion.div>
                        </header>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-sm"
                        >
                            <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-widest text-accent-mint/80">
                                <Code className="w-5 h-5" />
                                Project Overview
                            </h2>
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {project.description}
                                </ReactMarkdown>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-8 mt-12 pt-12 border-t border-white/5">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Role</h3>
                                    <p className="text-white font-bold">{project.role || "Lead Developer"}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Timeline</h3>
                                    <p className="text-white font-bold">{project.timeline || "2024 - Present"}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        {(project.liveDemo || project.github) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-4"
                            >
                                {project.liveDemo && (
                                    <a
                                        href={project.liveDemo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-accent-mint hover:bg-soft-mint text-theme-dark font-black tracking-widest uppercase text-sm transition-all duration-500 shadow-[0_0_30px_rgba(51,214,159,0.2)] hover:shadow-[0_0_50px_rgba(51,214,159,0.4)] group"
                                    >
                                        <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                        Live Preview
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-mint/30 text-white font-black tracking-widest uppercase text-sm transition-all duration-500 group"
                                    >
                                        <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Source Code
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="relative lg:sticky lg:top-32 h-fit"
                    >
                        <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                            <SafeImage
                                src={project.image}
                                alt={project.title}
                                className="transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/80 via-transparent to-transparent" />

                            {/* Device info overlay */}
                            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                        <Smartphone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                        <Zap className="w-5 h-5 text-accent-mint" />
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                                        <Server className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features List (Mocked/Implicit) */}
                        <div className="mt-12 grid grid-cols-2 gap-4">
                            {["Responsive Design", "Custom UI Components", "API Integration", "High Performance"].map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:border-accent-mint/20 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                    <span className="text-sm font-medium text-text-secondary">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* New Detailed Sections */}
                <div className="mt-16 space-y-16">
                    {/* Full Description Section */}
                    {project.fullDescription && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid lg:grid-cols-3 gap-12"
                        >
                            <div className="lg:col-span-1">
                                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4">
                                    <span className="text-accent-mint text-sm">01 /</span> Full Story
                                </h2>
                                <p className="text-text-muted mt-4 text-sm font-medium leading-relaxed">
                                    The complete narrative of why this project exists and the problems it addresses.
                                </p>
                            </div>
                            <div className="lg:col-span-2 markdown-content bg-white/[0.01] p-8 md:p-12 rounded-[2.5rem] border border-white/5 overflow-hidden break-words w-full max-w-full">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {project.fullDescription}
                                </ReactMarkdown>
                            </div>
                        </motion.section>
                    )}

                    {/* Architecture Section */}
                    {project.architecture && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 overflow-hidden relative"
                        >
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-mint/5 blur-[120px] rounded-full -mr-48 -mt-48" />

                            <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-start">
                                <div className="lg:col-span-1">
                                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-4 mb-4">
                                        <span className="text-accent-mint text-sm">02 /</span> Architecture
                                    </h2>
                                    <p className="text-text-secondary font-medium leading-relaxed mb-8">
                                        How the system is structured for scalability, performance, and maintainability.
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        {["Modular Components", "State Management", "Data Flow", "Security Patterns"].map((item) => (
                                            <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-accent-mint/60">
                                                <div className="w-1.5 h-1.5 bg-accent-mint rounded-full" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-2 markdown-content bg-black/40 p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden break-words w-full max-w-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {project.architecture}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Case Study / Challenges Section */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {project.caseStudy && (
                            <motion.section
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-10 md:p-16 rounded-[2.5rem] bg-accent-mint/5 border border-accent-mint/10"
                            >
                                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-4 mb-6">
                                    <span className="text-accent-mint text-xs">03 /</span> Case Study
                                </h2>
                                <div className="markdown-content overflow-hidden break-words w-full max-w-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {project.caseStudy}
                                    </ReactMarkdown>
                                </div>
                            </motion.section>
                        )}

                        {project.challenges && (
                            <motion.section
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-10 md:p-16 rounded-[2.5rem] bg-white/[0.02] border border-white/5"
                            >
                                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-4 mb-6 text-white">
                                    <span className="text-white/20 text-xs">04 /</span> Challenges
                                </h2>
                                <div className="markdown-content overflow-hidden break-words w-full max-w-full">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {project.challenges}
                                    </ReactMarkdown>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Tech Detailed Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-8"
                    >
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                                Technologies <span className="text-accent-mint">Engine</span>
                            </h2>
                            <p className="text-text-muted text-sm">
                                A breakdown of the primary tools and libraries that powered this implementation.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {project.techStack.map((tech, idx) => (
                                <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold tracking-wide hover:border-accent-mint/40 hover:bg-accent-mint/5 transition-all cursor-default"
                                >
                                    {tech}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}
