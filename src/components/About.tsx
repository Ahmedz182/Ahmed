"use client";

import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaMobileAlt, FaDesktop, FaServer, FaCreditCard } from "react-icons/fa";

export const About = () => {
    const highlights = [
        { title: "Frontend Development", icon: <FaDesktop className="w-5 h-5 text-accent-mint" /> },
        { title: "React & Next.js Ecosystem", icon: <FaReact className="w-5 h-5 text-accent-mint" /> },
        { title: "Mobile & React Native", icon: <FaMobileAlt className="w-5 h-5 text-accent-mint" /> },
        { title: "MERN Stack Dev", icon: <FaNodeJs className="w-5 h-5 text-accent-mint" /> },
        { title: "Database Integration", icon: <FaDatabase className="w-5 h-5 text-accent-mint" /> },
        { title: "REST APIs & Servers", icon: <FaServer className="w-5 h-5 text-accent-mint" /> },
        { title: "Custom Payment Solutions", icon: <FaCreditCard className="w-5 h-5 text-accent-mint" /> },
    ];

    return (
        <section id="about" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid md:grid-cols-2 gap-16 md:gap-12 lg:gap-24 items-stretch"
            >
                <div className="space-y-6 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                        About <span className="text-accent-mint">Me</span>
                    </h2>

                    <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                        <p>
                            Hi, I'm <strong className="text-white font-semibold">Ahmed Fayyaz</strong>.
                            A Software Engineer with a rich background in building modern web applications
                            using React, Next.js, and the MERN stack.
                        </p>
                        <p>
                            I take pride in crafting deep architectural solutions, emphasizing performance
                            optimization, and delivering user-centric designs that scale beautifully across devices.
                            Whether translating complex logic to flawless UI or working on server-side performance,
                            I make sure it feels intuitive and runs efficiently.
                        </p>
                        <p>
                            I specialize in creating end-to-end solutions that combine
                            performant backends with compelling frontends, including complex
                            implementations like <strong className="text-white font-semibold">localized payment gateways (PayHere, Stripe)</strong> and
                            cross-platform synchronization. Currently, I'm expanding my
                            backend expertise with Django while continuously exploring
                            system design and scalable development.
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm hover:border-accent-mint/30 transition-colors flex flex-col justify-between h-full">
                    <div>
                        <h3 className="text-2xl font-bold mb-8 text-white">
                            What I Do Best
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                            {highlights.map((item, idx) => (
                                <motion.li
                                    key={item.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    className="flex items-center justify-center md:justify-start text-text-secondary group"
                                >
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg group-hover:scale-110 group-hover:border-accent-mint/40 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] shrink-0 flex items-center justify-center mr-4">
                                        {item.icon}
                                    </div>
                                    <span className="text-sm font-semibold tracking-wide group-hover:text-white transition-colors">
                                        {item.title}
                                    </span>
                                </motion.li>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-white/10">
                        <p className="text-text-muted italic text-sm leading-relaxed border-l-2 border-accent-mint pl-4">
                            "Great engineering isn't just about writing code; it's about solving real
                            problems while crafting an unforgettable experience."
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
