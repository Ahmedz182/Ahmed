"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Tag, Share2, Bookmark } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { sileo } from "sileo";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    readTime: string;
    date: any;
}

export default function BlogDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "blogs", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBlog({ id: docSnap.id, ...docSnap.data() } as BlogPost);
                } else {
                    router.push("/#blog");
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-theme-dark flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-theme-dark text-white selection:bg-accent-mint/30">


            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-text-muted hover:text-accent-mint transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Back to Stories</span>
                </motion.button>

                {/* Article Header */}
                <article>
                    <header className="mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="px-4 py-1 bg-accent-mint/10 text-accent-mint border border-accent-mint/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                {blog.category}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]"
                        >
                            {blog.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-8 text-text-muted text-sm border-y border-white/5 py-6"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-accent-mint/20 flex items-center justify-center text-accent-mint">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="font-bold uppercase tracking-widest text-[10px]">
                                    {blog.date?.toDate ? format(blog.date.toDate(), "MMMM dd, yyyy") : "Published Recently"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="font-bold uppercase tracking-widest text-[10px]">{blog.readTime}</span>
                            </div>

                            <div className="ml-auto flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: blog.title,
                                                text: blog.excerpt,
                                                url: window.location.href,
                                            }).catch(console.error);
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            sileo.success({ description: "Link copied to clipboard!" });
                                        }
                                    }}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 hover:border-accent-mint/20 group/share"
                                    title="Share Story"
                                >
                                    <Share2 className="w-4 h-4 text-white/40 group-hover/share:text-accent-mint transition-colors" />
                                </button>
                                <button
                                    onClick={() => sileo.info({ description: "Bookmarks coming soon!" })}
                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 hover:border-accent-mint/20 group/book"
                                    title="Bookmark Story"
                                >
                                    <Bookmark className="w-4 h-4 text-white/40 group-hover/book:text-accent-mint transition-colors" />
                                </button>
                            </div>
                        </motion.div>
                    </header>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative aspect-[16/9] mb-16 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl"
                    >
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-invert prose-mint max-w-none 
                                   prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-lg
                                   prose-headings:text-white prose-headings:font-bold
                                   prose-strong:text-accent-mint prose-code:text-accent-mint 
                                   prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                                   prose-li:text-text-secondary prose-li:text-lg"
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {blog.content}
                        </ReactMarkdown>
                    </motion.div>

                    <footer className="mt-20 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
                            <div className="w-16 h-16 rounded-2xl bg-accent-mint/10 flex items-center justify-center text-accent-mint text-2xl font-black">
                                AF
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase tracking-widest text-xs">Ahmed Fayyaz</h4>
                                <p className="text-text-muted text-sm mt-1">Software Engineer & UI Designer sharing experiences from the digital trenches.</p>
                            </div>
                        </div>
                    </footer>
                </article>
            </main>


        </div>
    );
}
