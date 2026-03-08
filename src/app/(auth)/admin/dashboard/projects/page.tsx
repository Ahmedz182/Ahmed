"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Plus,
    Trash2,
    Edit2,
    ExternalLink,
    Github,
    Image as ImageIcon,
    Save,
    X,
    LayoutGrid,
    Search,
    Upload,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sileo } from "sileo";
import Image from "next/image";
import clsx from "clsx";

interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    liveDemo: string;
    github: string;
    createdAt: any;
}

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: [] as string[],
        image: "",
        liveDemo: "",
        github: ""
    });
    const [techInput, setTechInput] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Project));
            setProjects(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            techStack: [],
            image: "",
            liveDemo: "",
            github: ""
        });
        setTechInput("");
        setIsAdding(false);
        setEditingProject(null);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            image: project.image,
            liveDemo: project.liveDemo,
            github: project.github
        });
        setIsAdding(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            sileo.error({ description: "Please upload an image file." });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            sileo.error({ description: "Image size should be less than 5MB." });
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setFormData(prev => ({ ...prev, image: downloadURL }));
            sileo.success({ description: "Image uploaded successfully!" });
        } catch (error) {
            console.error("Upload error:", error);
            sileo.error({ description: "Failed to upload image." });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteDoc(doc(db, "projects", id));
            sileo.success({ description: "Project deleted successfully." });
        } catch (error) {
            sileo.error({ description: "Failed to delete project." });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await updateDoc(doc(db, "projects", editingProject.id), formData);
                sileo.success({ description: "Project updated successfully." });
            } else {
                await addDoc(collection(db, "projects"), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
                sileo.success({ description: "Project added successfully." });
            }
            resetForm();
        } catch (error) {
            sileo.error({ description: "Failed to save project." });
        }
    };

    const addTech = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && techInput.trim()) {
            e.preventDefault();
            if (!formData.techStack.includes(techInput.trim())) {
                setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] });
            }
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) });
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <DashboardShell title="Portfolio Projects" noScroll>
            <div className="h-full flex flex-col gap-6">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search projects or stack..."
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-mint text-theme-dark font-black rounded-2xl hover:scale-105 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                            <LayoutGrid className="w-16 h-16 mb-6" />
                            <h3 className="text-xl font-bold">No Projects Found</h3>
                            <p className="text-sm">Start by adding your first showcase project.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-12">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    key={project.id}
                                    className="group relative bg-white/[0.02] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-accent-mint/20 hover:bg-white/[0.04] transition-all duration-500 flex items-center p-3 gap-6"
                                >
                                    <div className="w-40 aspect-video relative rounded-xl overflow-hidden bg-black/40 shrink-0">
                                        {project.image ? (
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 opacity-20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold mb-1 truncate">{project.title}</h3>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {project.techStack.slice(0, 4).map(tech => (
                                                <span key={tech} className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-accent-mint/10 text-accent-mint rounded-md border border-accent-mint/5">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 4 && (
                                                <span className="text-[9px] font-black text-white/20">+{project.techStack.length - 4}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-white/20">
                                            {project.github && <Github className="w-3.5 h-3.5" />}
                                            {project.liveDemo && <ExternalLink className="w-3.5 h-3.5" />}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:text-accent-mint"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Slide-over Form */}
            <AnimatePresence>
                {isAdding && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={resetForm}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-screen w-full max-w-xl bg-theme-dark border-l border-white/5 z-[101] flex flex-col shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                                <h2 className="text-xl font-black uppercase tracking-tighter">
                                    {editingProject ? "Edit Project" : "New Project"}
                                </h2>
                                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-xl text-white/40">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Project Title</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. My Awesome Dashboard"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Keep it concise but impactful..."
                                        />
                                    </div>
                                </div>

                                {/* Media & Links */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Project Preview Image</label>
                                        <div className="space-y-4">
                                            {/* Preview Area */}
                                            {formData.image && (
                                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                                                    <Image
                                                        src={formData.image}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform shadow-xl"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Upload / URL Toggle */}
                                            <div className="flex gap-4">
                                                <label className={clsx(
                                                    "flex-1 flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                                                    uploading ? "opacity-50 cursor-not-allowed border-white/5" : "border-white/10 hover:border-accent-mint/30 hover:bg-accent-mint/5"
                                                )}>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={uploading}
                                                    />
                                                    {uploading ? (
                                                        <Loader2 className="w-8 h-8 text-accent-mint animate-spin" />
                                                    ) : (
                                                        <Upload className="w-8 h-8 text-accent-mint/40" />
                                                    )}
                                                    <div className="text-center">
                                                        <p className="text-sm font-bold text-white">Upload New Image</p>
                                                        <p className="text-[10px] text-text-muted">Directly to Firebase Storage</p>
                                                    </div>
                                                </label>

                                                <div className="w-1/3 flex flex-col gap-2">
                                                    <p className="text-[10px] font-black uppercase text-white/30 text-center">Or Use URL</p>
                                                    <input
                                                        type="url"
                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors h-full"
                                                        value={formData.image}
                                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">GitHub Repo</label>
                                            <input
                                                type="url"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Live Demo</label>
                                            <input
                                                type="url"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                value={formData.liveDemo}
                                                onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Tech Stack (Press Enter)</label>
                                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-4">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-none focus:outline-none text-sm mb-4"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyDown={addTech}
                                            placeholder="Add tech: Next.js, Firebase..."
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {formData.techStack.map(tech => (
                                                <span
                                                    key={tech}
                                                    className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-accent-mint/10 text-accent-mint rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent-mint/20"
                                                >
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTech(tech)}
                                                        className="hover:text-white transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Submission */}
                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-accent-mint text-theme-dark font-black rounded-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(51,214,159,0.2)]"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingProject ? "Update Project" : "Publish Project"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardShell>
    );
}
