"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Plus,
    Trash2,
    Loader2,
    Calendar,
    Clock,
    Image as ImageIcon,
    PenTool,
    Search,
    Edit3
} from "lucide-react";
import { motion } from "framer-motion";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import { format } from "date-fns";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    readTime: string;
    date: any;
    published: boolean;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await deleteDoc(doc(db, "blogs", id));
            sileo.success({ description: "Post deleted permanently." });
        } catch (error) {
            sileo.error({ description: "Failed to delete post." });
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardShell title="Content Studio" noScroll>
            <div className="flex flex-col h-full gap-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                            <PenTool className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tighter text-white">Blog Manager</h2>
                            <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest leading-none mt-0.5">Manage Your Stories</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-mint/50 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-6 text-xs outline-none focus:border-accent-mint/30 w-64 transition-all"
                            />
                        </div>

                        <Link
                            href="/admin/dashboard/blogs/new"
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent-mint text-theme-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent-mint/10"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Write Post</span>
                        </Link>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-accent-mint" />
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-accent-mint/20 transition-all flex flex-col relative"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={blog.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="px-3 py-1 bg-theme-dark/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 text-accent-mint">
                                                {blog.category}
                                            </span>
                                            {!blog.published && (
                                                <span className="px-3 py-1 bg-red-500/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-red-500/10 text-red-500">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {blog.date?.toDate ? format(blog.date.toDate(), "MMM dd, yyyy") : "Recent"}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tight mb-3 line-clamp-2 leading-relaxed">{blog.title}</h3>
                                        <p className="text-xs text-text-muted line-clamp-3 mb-8 flex-1">{blog.excerpt}</p>

                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/dashboard/blogs/${blog.id}`}
                                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase py-4 rounded-xl transition-all"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                Edit Post
                                            </Link>
                                            <button
                                                onClick={(e) => handleDelete(blog.id, e)}
                                                className="px-4 bg-red-500/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] text-center px-6">
                            <ImageIcon className="w-12 h-12 text-white/5 mb-4" />
                            <h3 className="text-white/40 text-sm font-black uppercase tracking-widest">No Stories Found</h3>
                            <p className="text-white/20 text-xs mt-2 max-w-xs">Start sharing your thoughts with the world. Click the "Write Post" button above.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
    );
}
