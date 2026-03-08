"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Save,
    Loader2,
    Calendar,
    Clock,
    Tag,
    Image as ImageIcon,
    ArrowLeft,
    Eye,
    PenTool
} from "lucide-react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { sileo } from "sileo";
import { useRouter, useParams } from "next/navigation";
import clsx from "clsx";
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

export default function BlogEditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const isNew = id === "new";

    const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
        title: "",
        excerpt: "",
        content: "",
        category: "General",
        readTime: "5 min read",
        published: true,
        image: ""
    });

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (!isNew) {
            const fetchBlog = async () => {
                try {
                    const docRef = doc(db, "blogs", id as string);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setCurrentBlog({ id: docSnap.id, ...docSnap.data() } as BlogPost);
                    } else {
                        sileo.error({ description: "Blog post not found." });
                        router.push("/admin/dashboard/blogs");
                    }
                } catch (error) {
                    sileo.error({ description: "Error fetching blog post." });
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        }
    }, [id, isNew, router]);

    const handleSave = async () => {
        if (!currentBlog?.title || !currentBlog?.content) {
            sileo.error({ description: "Title and Content are required." });
            return;
        }

        setSaving(true);
        try {
            const blogData = {
                ...currentBlog,
                date: currentBlog.date || serverTimestamp(),
                updatedAt: serverTimestamp(),
                published: currentBlog.published ?? true,
                readTime: currentBlog.readTime || "5 min read"
            };

            if (!isNew) {
                await setDoc(doc(db, "blogs", id as string), blogData);
                sileo.success({ description: "Blog post updated successfully!" });
            } else {
                await addDoc(collection(db, "blogs"), blogData);
                sileo.success({ description: "New blog post published!" });
            }
            router.push("/admin/dashboard/blogs");
        } catch (error) {
            console.error("Save error:", error);
            sileo.error({ description: "Failed to save blog post." });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setCurrentBlog(prev => ({ ...prev, image: url }));
            sileo.success({ description: "Image uploaded successfully!" });
        } catch (error) {
            sileo.error({ description: "Image upload failed." });
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell title="Editor" noScroll>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-mint" />
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell title={isNew ? "Create Story" : "Edit Story"} noScroll>
            <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto pb-20 overflow-y-auto custom-scrollbar pr-4">
                <div className="flex items-center justify-between sticky top-0 py-4 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/dashboard/blogs"
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/40" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                                {isNew ? "Compose New Story" : "Revise Story"}
                            </h2>
                            <p className="text-[10px] text-accent-mint font-bold uppercase tracking-widest mt-1">Insight Studio / {isNew ? "New Draft" : currentBlog.title?.substring(0, 20) + "..."}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-accent-mint text-theme-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-mint/10 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isNew ? "Publish Post" : "Save Changes"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Title of the Insight</label>
                            <input
                                type="text"
                                value={currentBlog.title}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                                placeholder="Enter a compelling title..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-lg font-bold outline-none focus:border-accent-mint/40 text-white transition-all placeholder:text-white/10"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Brief Summary / Excerpt</label>
                            <textarea
                                value={currentBlog.excerpt}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                                placeholder="Provide a short hook for your readers..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-sm outline-none focus:border-accent-mint/40 text-white/70 h-32 resize-none transition-all placeholder:text-white/10 leading-relaxed"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Story Content</label>
                                <span className="text-[8px] font-bold text-accent-mint tracking-[0.2em] uppercase opacity-40">Markdown Enabled</span>
                            </div>
                            <textarea
                                value={currentBlog.content}
                                onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                                placeholder="Start writing your masterpiece..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] py-8 px-10 text-sm outline-none focus:border-accent-mint/40 text-white/90 h-[500px] resize-none transition-all placeholder:text-white/10 leading-[1.8] font-mono"
                            />
                        </div>
                    </div>

                    {/* Right: Meta & Settings */}
                    <div className="space-y-8">
                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Cover Visualization</label>
                            <div
                                className="relative aspect-[16/10] rounded-[2.5rem] bg-white/[0.03] border-2 border-dashed border-white/10 hover:border-accent-mint/30 overflow-hidden group cursor-pointer transition-all"
                                onClick={() => document.getElementById('blog-image-upload')?.click()}
                            >
                                {uploadingImage ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-10">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-accent-mint" />
                                            <span className="text-[8px] font-black uppercase text-white/40 tracking-[0.3em]">Uploading Asset</span>
                                        </div>
                                    </div>
                                ) : currentBlog.image ? (
                                    <>
                                        <img src={currentBlog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <PenTool className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10 group-hover:text-accent-mint/40 transition-all">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent-mint/5">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Select Asset</span>
                                        <span className="text-[8px] font-bold opacity-30 mt-2 lowercase">JPG, PNG or WebP</span>
                                    </div>
                                )}
                                <input type="file" id="blog-image-upload" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </div>
                        </div>

                        {/* Taxonomy & Stats */}
                        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Classification</label>
                                <div className="relative">
                                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={currentBlog.category}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                                        placeholder="e.g. Next.js, AI, Design"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-accent-mint/30 text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Reading Velocity</label>
                                <div className="relative">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="text"
                                        value={currentBlog.readTime}
                                        onChange={(e) => setCurrentBlog({ ...currentBlog, readTime: e.target.value })}
                                        placeholder="e.g. 5 min read"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-accent-mint/30 text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white tracking-widest">Visibility</p>
                                    <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest mt-1">Live on Website</p>
                                </div>
                                <button
                                    onClick={() => setCurrentBlog({ ...currentBlog, published: !currentBlog.published })}
                                    className={clsx(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        currentBlog.published ? "bg-accent-mint shadow-[0_0_15px_rgba(51,214,159,0.3)]" : "bg-white/10"
                                    )}
                                >
                                    <div className={clsx(
                                        "absolute top-1 w-4 h-4 rounded-full transition-all",
                                        currentBlog.published ? "right-1 bg-theme-dark" : "left-1 bg-white/40"
                                    )} />
                                </button>
                            </div>
                        </div>

                        {/* Quick View */}
                        <div className="p-8 bg-accent-mint/5 border border-accent-mint/10 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black uppercase text-accent-mint tracking-widest mb-4">Pro-Tip 🚀</h4>
                            <p className="text-[10px] text-accent-mint/60 leading-relaxed font-bold">
                                Use high-quality visual assets for your cover image. Consistent branding across your "Insights" section builds user trust and authority.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
