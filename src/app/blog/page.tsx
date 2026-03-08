"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: any;
    readTime: string;
    category: string;
    image: string;
}

export default function BlogListPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        console.log("Initializing blog fetch...");

        const q = query(
            collection(db, "blogs")
        );

        const unsub = onSnapshot(q,
            (snapshot) => {
                console.log(`Blog snapshot received: ${snapshot.size} docs`);
                setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
                setLoading(false);
            },
            (error) => {
                console.error("Firebase Blog Fetch Error:", error);
                setLoading(false);
            }
        );

        // Safety fallback: cancel loading if it takes too long
        const timer = setTimeout(() => {
            if (loading) {
                console.warn("Blog fetch timed out after 5s.");
                setLoading(false);
            }
        }, 5000);

        return () => {
            unsub();
            clearTimeout(timer);
        };
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-theme-dark text-white">


            <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            The <span className="text-accent-mint">Archive</span>
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl">
                            A collection of thoughts, technical deep dives, and stories from my journey in software engineering.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group w-full md:w-80"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-mint transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter stories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:border-accent-mint/30 transition-all"
                        />
                    </motion.div>
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                            >
                                <Link
                                    href={`/blog/${post.id}`}
                                    className="group flex flex-col bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.05] hover:border-accent-mint/30 transition-all duration-300 h-full"
                                >
                                    <div className="relative h-60 overflow-hidden">
                                        <img
                                            src={post.image || "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800"}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className="px-4 py-1.5 bg-theme-dark/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-accent-mint shadow-xl">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-grow">
                                        <div className="flex items-center gap-6 text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mb-6">
                                            <span className="flex items-center gap-2 underline decoration-accent-mint/20 underline-offset-4"><Calendar className="w-3.5 h-3.5" /> {post.date?.toDate ? format(post.date.toDate(), "MMM dd, yyyy") : "Recent"}</span>
                                            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-mint transition-colors line-clamp-2 leading-tight">
                                            {post.title}
                                        </h3>

                                        <p className="text-text-secondary leading-relaxed text-sm mb-10 flex-grow line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between group/btn py-4 px-6 bg-white/5 rounded-2xl border border-white/5 group-hover:border-accent-mint/20 group-hover:bg-white/10 transition-all mt-auto">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-accent-mint transition-colors">Read Article</span>
                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 group-hover:text-accent-mint transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] text-center px-6">
                        <Tag className="w-16 h-16 text-white/5 mb-6" />
                        <h3 className="text-white/40 text-xl font-black uppercase tracking-widest">No Stories Match Your Search</h3>
                        <p className="text-white/20 text-sm mt-4 max-w-sm">Try using different keywords or categories to find what you're looking for.</p>
                    </div>
                )}
            </main>

        </div>
    );
}
