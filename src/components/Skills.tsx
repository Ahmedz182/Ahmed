"use client";

import { motion } from "framer-motion";
import { Layers, Database, Wrench } from "lucide-react";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaFigma, FaWordpress } from "react-icons/fa";
import { SiNextdotjs, SiJavascript, SiTailwindcss, SiExpress, SiMongodb, SiPostman, SiDjango, SiWebflow } from "react-icons/si";
import { GitBranch } from "lucide-react";

export const Skills = () => {
    const categories = [
        {
            title: "Frontend",
            icon: <Layers className="w-6 h-6 text-accent-mint" />,
            skills: [
                { name: "React", icon: <FaReact className="w-4 h-4" /> },
                { name: "React Native", icon: <FaReact className="w-4 h-4" /> },
                { name: "Next.js", icon: <SiNextdotjs className="w-4 h-4" /> },
                { name: "JavaScript", icon: <SiJavascript className="w-4 h-4" /> },
                { name: "HTML5", icon: <FaHtml5 className="w-4 h-4" /> },
                { name: "CSS3", icon: <FaCss3Alt className="w-4 h-4" /> },
                { name: "Tailwind CSS", icon: <SiTailwindcss className="w-4 h-4" /> },
            ],
        },
        {
            title: "Backend",
            icon: <Database className="w-6 h-6 text-accent-mint" />,
            skills: [
                { name: "Node.js", icon: <FaNodeJs className="w-4 h-4" /> },
                { name: "Express.js", icon: <SiExpress className="w-4 h-4" /> },
                { name: "MongoDB", icon: <SiMongodb className="w-4 h-4" /> },
                { name: "REST APIs", icon: <Database className="w-4 h-4" /> },
                { name: "Django (learning)", icon: <SiDjango className="w-4 h-4" /> },
            ],
        },
        {
            title: "Tools & Workflow",
            icon: <Wrench className="w-6 h-6 text-accent-mint" />,
            skills: [
                { name: "Git", icon: <GitBranch className="w-4 h-4" /> },
                { name: "GitHub", icon: <FaGithub className="w-4 h-4" /> },
                { name: "VS Code", icon: <Wrench className="w-4 h-4" /> },
                { name: "Postman", icon: <SiPostman className="w-4 h-4" /> },
                { name: "Figma", icon: <FaFigma className="w-4 h-4" /> },
                { name: "WordPress", icon: <FaWordpress className="w-4 h-4" /> },
                { name: "Webflow", icon: <SiWebflow className="w-4 h-4" /> },
            ],
        },
    ];

    return (
        <section id="skills" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto">
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
                    {categories.map((cat, catIdx) => (
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
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill.name}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-white/5 border border-white/5 text-text-secondary group-hover:text-white transition-colors cursor-default"
                                    >
                                        <span className="text-accent-mint opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            {skill.icon}
                                        </span>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
