"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: any;
    readTime: string;
    category: string;
    image: string;
    published?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export const Blog = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "blogs"),
            orderBy("date", "desc"),
            limit(10)
        );
        const unsub = onSnapshot(q,
            (snapshot) => {
                const posts = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as BlogPost))
                    .filter(p => p.published === true)
                    .slice(0, 3);
                setBlogPosts(posts);
                setLoading(false);
            },
            (error) => {
                console.error("Home Blog Error:", error);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    return (
        <section id="blog" className="w-full py-10 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden scroll-mt-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-mint/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, ease: EASE }}
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
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
                >
                    <Link
                        href="/blog"
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-accent-mint/30 transition-all font-medium whitespace-nowrap"
                    >
                        View All Posts
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {blogPosts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 50, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: EASE }}
                        whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
                        className="mb-8"
                    >
                        <Link
                            href={`/blog/${post.id}`}
                            className="group flex flex-col bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.05] hover:border-accent-mint/30 transition-colors duration-300 shadow-xl h-full"
                        >
                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden">
                                <div className="absolute inset-0 bg-theme-dark/40 group-hover:bg-transparent transition-colors z-10" />
                                <img
                                    src={post.image || "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800"}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="px-3 py-1 text-xs font-bold tracking-wider text-accent-mint bg-theme-dark/80 backdrop-blur-md rounded-full border border-white/10 uppercase">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-text-muted text-sm mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.date?.toDate ? format(post.date.toDate(), "MMM dd, yyyy") : "Recent"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-mint transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-text-secondary leading-relaxed text-sm mb-6 flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="inline-flex items-center text-sm font-bold text-accent-mint mt-auto">
                                    Read Article
                                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {loading && blogPosts.length === 0 && (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
                </div>
            )}
        </section>
    );
};
