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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    rows?: number;
}

const MarkdownEditor = ({ label, value, onChange, placeholder, rows = 10 }: MarkdownEditorProps) => {
    const [isPreview, setIsPreview] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block">{label}</label>
                <div className="flex bg-white/5 rounded-lg p-0.5">
                    <button
                        type="button"
                        onClick={() => setIsPreview(false)}
                        className={clsx(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                            !isPreview ? "bg-accent-mint text-theme-dark" : "text-white/40 hover:text-white"
                        )}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPreview(true)}
                        className={clsx(
                            "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                            isPreview ? "bg-accent-mint text-theme-dark" : "text-white/40 hover:text-white"
                        )}
                    >
                        Preview
                    </button>
                </div>
            </div>

            {isPreview ? (
                <div className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-5 py-4 min-h-[150px] markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value || "_No content to preview_"}
                    </ReactMarkdown>
                </div>
            ) : (
                <textarea
                    rows={rows}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors font-mono"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image: string;
    images?: string[];
    liveDemo: string;
    github: string;
    // Detailed sections
    fullDescription?: string;
    architecture?: string;
    caseStudy?: string;
    challenges?: string;
    role?: string;
    timeline?: string;
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
        images: [] as string[],
        liveDemo: "",
        github: "",
        fullDescription: "",
        architecture: "",
        caseStudy: "",
        challenges: "",
        role: "",
        timeline: ""
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
            github: "",
            fullDescription: "",
            architecture: "",
            caseStudy: "",
            challenges: "",
            role: "",
            timeline: "",
            images: [],
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
            images: project.images || [],
            liveDemo: project.liveDemo,
            github: project.github,
            fullDescription: project.fullDescription || "",
            architecture: project.architecture || "",
            caseStudy: project.caseStudy || "",
            challenges: project.challenges || "",
            role: project.role || "",
            timeline: project.timeline || ""
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

            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), downloadURL],
                // Set as main image if none exists
                image: prev.image || downloadURL
            }));
            sileo.success({ description: "Image added to gallery!" });
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
                {!isAdding && (
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
                )}

                {/* Projects Grid or Full Page Form */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {isAdding ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-5xl mx-auto pb-20"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter">
                                    {editingProject ? "Edit Project" : "Create New Project"}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                    <span>Cancel</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid lg:grid-cols-2 gap-12">
                                    {/* Left Side: General & Tech */}
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-mint flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                                Basic Information
                                            </h3>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Project Title</label>
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    placeholder="Project Name"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Short Description</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors resize-none"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="A brief overview for the listing page..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 border-t border-white/5 pt-8">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-mint flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                                Technical Details
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Role</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                        placeholder="Lead Developer"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Timeline</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                        value={formData.timeline}
                                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                        placeholder="e.g. 2024"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Tech Stack</label>
                                                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-4">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-transparent border-none focus:outline-none text-sm mb-4"
                                                        value={techInput}
                                                        onChange={(e) => setTechInput(e.target.value)}
                                                        onKeyDown={addTech}
                                                        placeholder="Add tech & press enter..."
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.techStack.map(tech => (
                                                            <span key={tech} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-accent-mint/10 text-accent-mint rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent-mint/20">
                                                                {tech}
                                                                <button type="button" onClick={() => removeTech(tech)} className="hover:text-white transition-colors">
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Media & Links */}
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-mint flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                                Project Gallery
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <AnimatePresence>
                                                    {formData.images?.map((img, idx) => (
                                                        <motion.div
                                                            key={img}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10"
                                                        >
                                                            <Image src={img} alt="Gallery" fill className="object-cover" />
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, image: img }))}
                                                                    className={clsx(
                                                                        "p-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-tighter",
                                                                        formData.image === img ? "bg-accent-mint text-theme-dark" : "bg-white/10 text-white hover:bg-white/20"
                                                                    )}
                                                                >
                                                                    {formData.image === img ? "Main" : "Set Main"}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({
                                                                        ...prev,
                                                                        images: prev.images.filter(i => i !== img),
                                                                        image: prev.image === img ? (prev.images.find(i => i !== img) || "") : prev.image
                                                                    }))}
                                                                    className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>

                                                <label className={clsx(
                                                    "flex flex-col items-center justify-center gap-3 aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                                                    uploading ? "opacity-30 pointer-events-none" : "border-white/10 hover:border-accent-mint/30 hover:bg-accent-mint/5"
                                                )}>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                                    {uploading ? <Loader2 className="w-6 h-6 text-accent-mint animate-spin" /> : <Plus className="w-6 h-6 text-accent-mint/40" />}
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Add Image</p>
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="pt-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Direct Image URL</label>
                                                <input
                                                    type="url"
                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const url = (e.target as HTMLInputElement).value;
                                                            if (url && !formData.images.includes(url)) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    images: [...prev.images, url],
                                                                    image: prev.image || url
                                                                }));
                                                                (e.target as HTMLInputElement).value = "";
                                                            }
                                                        }
                                                    }}
                                                    placeholder="Paste URL and press Enter..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 border-t border-white/5 pt-8">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-mint flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                                External Links
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">GitHub Repo</label>
                                                        <div className="relative">
                                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                type="url"
                                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                                value={formData.github}
                                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Live Demo</label>
                                                        <div className="relative">
                                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                            <input
                                                                type="url"
                                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                                value={formData.liveDemo}
                                                                onChange={(e) => setFormData({ ...formData, liveDemo: e.target.value })}
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Width: Detailed Markdown Content */}
                                <div className="space-y-12 border-t border-white/5 pt-12 mt-12">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent-mint flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent-mint" />
                                            Case Study & Deep Dive
                                        </h3>
                                        <span className="text-[10px] font-black px-3 py-1 bg-white/5 rounded-full text-white/20 uppercase tracking-widest">Supports Rich Markdown</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12">
                                        <MarkdownEditor
                                            label="Full Project Story / Overview"
                                            value={formData.fullDescription}
                                            onChange={(val) => setFormData({ ...formData, fullDescription: val })}
                                            placeholder="Introduce the project, the mission, and the core value..."
                                            rows={12}
                                        />

                                        <MarkdownEditor
                                            label="Architecture & System Design"
                                            value={formData.architecture}
                                            onChange={(val) => setFormData({ ...formData, architecture: val })}
                                            placeholder="Explain how it was built, the stack choices, and logic flow..."
                                            rows={8}
                                        />

                                        <div className="grid md:grid-cols-2 gap-12">
                                            <MarkdownEditor
                                                label="Case Study / Business Logic"
                                                value={formData.caseStudy}
                                                onChange={(val) => setFormData({ ...formData, caseStudy: val })}
                                                placeholder="What were the goals? What was the outcome?"
                                                rows={8}
                                            />
                                            <MarkdownEditor
                                                label="Technical Challenges & Solutions"
                                                value={formData.challenges}
                                                onChange={(val) => setFormData({ ...formData, challenges: val })}
                                                placeholder="Detail specific blockers and how you engineered around them..."
                                                rows={8}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button at the very end */}
                                <div className="pt-12 border-t border-white/10">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-4 py-6 bg-accent-mint text-theme-dark font-black rounded-[2.5rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_60px_rgba(51,214,159,0.2)] group text-lg uppercase tracking-widest"
                                    >
                                        <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span>{editingProject ? "Update Project Showcase" : "Publish to Portfolio"}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : loading ? (
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

                                    <div className="flex-1 min-w-0 text-left">
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
        </DashboardShell>
    );
}
