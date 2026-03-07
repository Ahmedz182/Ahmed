"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

export const Projects = () => {
    const projects = [
        {
            title: "All English SeTranslator",
            description: "Mobile & Web App. Built structured English learning platform with progress tracking & subscription system. Implemented JWT authentication & payment integration. Integrated media resources (video/PDF) with scalable API architecture.",
            techStack: ["React Native", "Next.js", "JWT", "REST API"],
            image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNDAwJyB2aWV3Qm94PScwIDAgODAwIDQwMCc+PHJlY3Qgd2lkdGg9JzgwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyMwQjNEMkUnLz48dGV4dCB4PSc0MDAlJyB5PSc1MCUnIGZvbnQtZmFtaWx5PSdOdW5pdG8gU2FucywnIGZvbnQtc2l6ZT0nMzJweCcgZmlsbD0nIzdGRThDNycgZDominantLWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkFsbCBFbmdsaXNoIFNlVHJhbnNsYXRvcjwvdGV4dD48L3N2Zz4+",
            liveDemo: "#",
            github: "#",
        },
        {
            title: "Vortex",
            description: "Web App. Developed role-based dashboards for booking & staff management. Implemented real-time chat & audio support. Designed modular, scalable architecture.",
            techStack: ["Next.js", "REST API", "Web Sockets"],
            image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNDAwJyB2aWV3Qm94PScwIDAgODAwIDQwMCc+PHJlY3Qgd2lkdGg9JzgwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyMwRTVBNDUnLz48dGV4dCB4PSc0MDAlJyB5PSc1MCUnIGZvbnQtZmFtaWx5PSdOdW5pdG8gU2FucywnIGZvbnQtc2l6ZT0nMzJweCcgZmlsbD0nIzMzRDY5RicgZDominantLWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPlZvcnRleDwvdGV4dD48L3N2Zz4=",
            liveDemo: "#",
            github: "#",
        },
        {
            title: "Coin Theaters",
            description: "Web App. Integrated low-latency live streaming (AWS IVS). Built crowdfunding workflows & secure authentication (AWS Cognito). Optimized APIs & real-time data handling for scalability.",
            techStack: ["Next.js", "REST API", "AWS Cognito", "AWS IVS"],
            image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4MDAnIGhlaWdodD0nNDAwJyB2aWV3Qm94PScwIDAgODAwIDQwMCc+PHJlY3Qgd2lkdGg9JzgwMCcgaGVpZ2h0PSc0MDAnIGZpbGw9JyMwNzFFMkYnLz48dGV4dCB4PSc0MDAlJyB5PSc1MCUnIGZvbnQtZmFtaWx5PSdOdW5pdG8gU2FucywnIGZvbnQtc2l6ZT0nMzJweCcgZmlsbD0nI0M4RTZEQicgZDominantLWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnPkNvaW4gVGhlYXRlcnM8L3RleHQ+PC9zdmc+",
            liveDemo: "#",
            github: "#",
        },
    ];

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
                            key={proj.title}
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
