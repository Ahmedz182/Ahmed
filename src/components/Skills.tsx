"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Database, Wrench, Code2, Globe, Cpu, Terminal, Shield, Workflow, GitBranch } from "lucide-react";
import {
    FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaFigma, FaWordpress,
    FaPython, FaDocker, FaVuejs, FaAngular, FaSass, FaBootstrap, FaLaravel,
    FaDatabase, FaCloud, FaServer, FaMobileAlt, FaGitAlt
} from "react-icons/fa";
import {
    SiNextdotjs, SiJavascript, SiTailwindcss, SiExpress, SiMongodb,
    SiPostman, SiDjango, SiWebflow, SiTypescript, SiFirebase, SiPostgresql,
    SiRedis, SiVercel, SiNetlify, SiSupabase, SiPrisma, SiGraphql, SiRedux,
    SiFramer, SiOpenai, SiGooglecloud, SiFlutter
} from "react-icons/si";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Skill {
    name: string;
    category: "Frontend" | "Backend" | "Tools";
}

// Icon Mapping Strategy
const getSkillIcon = (name: string) => {
    const n = name.toLowerCase();

    // Exact Matches
    if (n.includes("react native")) return <FaMobileAlt className="w-4 h-4" />;
    if (n.includes("react")) return <FaReact className="w-4 h-4" />;
    if (n.includes("next.js") || n.includes("nextjs")) return <SiNextdotjs className="w-4 h-4" />;
    if (n.includes("html")) return <FaHtml5 className="w-4 h-4" />;
    if (n.includes("tailwind")) return <SiTailwindcss className="w-4 h-4" />;
    if (n.includes("css")) return <FaCss3Alt className="w-4 h-4" />;
    if (n.includes("javascript") || n === "js") return <SiJavascript className="w-4 h-4" />;
    if (n.includes("typescript") || n === "ts") return <SiTypescript className="w-4 h-4" />;
    if (n.includes("node")) return <FaNodeJs className="w-4 h-4" />;
    if (n.includes("express")) return <SiExpress className="w-4 h-4" />;
    if (n.includes("mongo")) return <SiMongodb className="w-4 h-4" />;
    if (n.includes("firebase")) return <SiFirebase className="w-4 h-4" />;
    if (n.includes("postgres")) return <SiPostgresql className="w-4 h-4" />;
    if (n.includes("sql") || n.includes("database")) return <FaDatabase className="w-4 h-4" />;
    if (n.includes("git") && !n.includes("github")) return <FaGitAlt className="w-4 h-4" />;
    if (n.includes("github")) return <FaGithub className="w-4 h-4" />;
    if (n.includes("docker")) return <FaDocker className="w-4 h-4" />;
    if (n.includes("postman")) return <SiPostman className="w-4 h-4" />;
    if (n.includes("figma")) return <FaFigma className="w-4 h-4" />;
    if (n.includes("wordpress")) return <FaWordpress className="w-4 h-4" />;
    if (n.includes("webflow")) return <SiWebflow className="w-4 h-4" />;
    if (n.includes("django")) return <SiDjango className="w-4 h-4" />;
    if (n.includes("python")) return <FaPython className="w-4 h-4" />;
    if (n.includes("vue")) return <FaVuejs className="w-4 h-4" />;
    if (n.includes("angular")) return <FaAngular className="w-4 h-4" />;
    if (n.includes("sass")) return <FaSass className="w-4 h-4" />;
    if (n.includes("bootstrap")) return <FaBootstrap className="w-4 h-4" />;
    if (n.includes("laravel")) return <FaLaravel className="w-4 h-4" />;
    if (n.includes("api") || n.includes("rest")) return <Cpu className="w-4 h-4" />;
    if (n.includes("cloud") || n.includes("vercel") || n.includes("netlify")) return <SiVercel className="w-4 h-4" />;
    if (n.includes("ai") || n.includes("openai")) return <SiOpenai className="w-4 h-4" />;
    if (n.includes("flutter")) return <SiFlutter className="w-4 h-4" />;

    // Default icons based on context or generic
    return <Terminal className="w-4 h-4" />;
};

export const Skills = () => {
    const [techStack, setTechStack] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const docRef = doc(db, "metadata", "settings");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.techStack) {
                        setTechStack(data.techStack);
                    }
                }
            } catch (error) {
                console.error("Error loading skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const categories = [
        {
            title: "Frontend",
            icon: <Layers className="w-6 h-6 text-accent-mint" />,
            key: "Frontend"
        },
        {
            title: "Backend",
            icon: <Database className="w-6 h-6 text-accent-mint" />,
            key: "Backend"
        },
        {
            title: "Tools & Workflow",
            icon: <Wrench className="w-6 h-6 text-accent-mint" />,
            key: "Tools"
        },
    ];

    if (loading) return null;

    return (
        <section id="skills" className="w-full py-10 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
            <div className="space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Technical <span className="text-accent-mint">Arsenal</span>
                    </h2>
                    <p className="mt-4 text-text-secondary max-w-2xl text-lg">
                        A comprehensive overview of my current tech stack and the tools I
                        use to build digital products.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map((cat, catIdx) => {
                        const skills = techStack.filter(s => s.category === cat.key);
                        if (skills.length === 0) return null;

                        return (
                            <motion.div
                                key={cat.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: catIdx * 0.15, duration: 0.5 }}
                                className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 hover:shadow-[0_10px_40px_-15px_rgba(51,214,159,0.1)] hover:border-accent-mint/30"
                            >
                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-6 tracking-wide">
                                    {cat.title}
                                </h3>

                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill.name}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-white/5 border border-white/5 text-text-secondary group-hover:text-white transition-colors cursor-default"
                                        >
                                            <span className="text-accent-mint opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                {getSkillIcon(skill.name)}
                                            </span>
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
