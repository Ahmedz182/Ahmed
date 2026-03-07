"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const Blog = () => {
    const blogPosts = [
        {
            title: "Mastering Next.js 14 Server Actions",
            excerpt: "Learn how to build full-stack applications with simplified data mutations and enhanced security using the latest Server Actions in Next.js 14.",
            date: "Oct 12, 2023",
            readTime: "5 min read",
            category: "Next.js",
            image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
            link: "#"
        },
        {
            title: "The Future of CSS: Tailwind vs Custom Architecture",
            excerpt: "An in-depth comparison of utility-first CSS frameworks like Tailwind against modern custom CSS architecture and when to use which approach.",
            date: "Sep 28, 2023",
            readTime: "8 min read",
            category: "Styling",
            image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
            link: "#"
        },
        {
            title: "Building Accessible UI Components in React",
            excerpt: "A comprehensive guide on creating inclusive and accessible web applications following ARIA guidelines and best practices in React.",
            date: "Sep 15, 2023",
            readTime: "6 min read",
            category: "Accessibility",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
            link: "#"
        }
    ];

    return (
        <section id="blog" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-mint/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Latest <span className="text-accent-mint">Insights</span>
                    </h2>
                    <p className="text-text-secondary text-lg">
                        Thoughts, tutorials, and deep dives into modern frontend development, UI design, and software engineering.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <a
                        href="#"
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent-mint/30 transition-all font-medium whitespace-nowrap"
                    >
                        View All Posts
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {blogPosts.map((post, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        className="group flex flex-col bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-accent-mint/30 transition-all duration-300 shadow-xl"
                    >
                        {/* Image Container */}
                        <div className="relative h-56 w-full overflow-hidden">
                            <div className="absolute inset-0 bg-theme-dark/40 group-hover:bg-transparent transition-colors z-10" />
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <span className="px-3 py-1 text-xs font-bold tracking-wider text-accent-mint bg-theme-dark/80 backdrop-blur-md rounded-full border border-white/10 uppercase">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-text-muted text-sm mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-mint transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-text-secondary leading-relaxed text-sm mb-6 flex-grow line-clamp-3">
                                {post.excerpt}
                            </p>

                            <a
                                href={post.link}
                                className="inline-flex items-center text-sm font-bold text-accent-mint mt-auto group/link"
                            >
                                Read Article
                                <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
