"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Plus,
    Trash2,
    Edit2,
    Building2,
    Save,
    X,
    Briefcase,
    GripVertical,
    Clock
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
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import clsx from "clsx";

interface Experience {
    id: string;
    title: string;
    company: string;
    date: string;
    description: string;
    order: number;
    createdAt: any;
    isActive?: boolean;
}

export default function ExperienceAdmin() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        date: "",
        description: "",
        order: 0,
        isActive: true
    });

    useEffect(() => {
        const q = query(collection(db, "experience"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Experience));
            setExperiences(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            company: "",
            date: "",
            description: "",
            order: experiences.length + 1,
            isActive: true
        });
        setIsAdding(false);
        setEditingExp(null);
    };

    const handleEdit = (exp: Experience) => {
        setEditingExp(exp);
        setFormData({
            title: exp.title,
            company: exp.company,
            date: exp.date,
            description: exp.description,
            order: exp.order,
            isActive: exp.isActive !== undefined ? exp.isActive : true
        });
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this experience from your journey?")) return;
        try {
            await deleteDoc(doc(db, "experience", id));
            sileo.success({ description: "Experience record removed." });
        } catch (error) {
            sileo.error({ description: "Failed to delete record." });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExp) {
                await updateDoc(doc(db, "experience", editingExp.id), formData);
                sileo.success({ description: "Journal updated successfully." });
            } else {
                await addDoc(collection(db, "experience"), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
                sileo.success({ description: "New milestone added!" });
            }
            resetForm();
        } catch (error) {
            sileo.error({ description: "Failed to save milestone." });
        }
    };

    const toggleExperienceStatus = async (exp: Experience) => {
        try {
            const newStatus = exp.isActive !== undefined ? !exp.isActive : false;
            await updateDoc(doc(db, "experience", exp.id), { isActive: newStatus });
            sileo.success({ description: `Milestone set to ${newStatus ? 'Visible' : 'Hidden'}` });
        } catch (error) {
            sileo.error({ description: "Failed to update milestone status." });
        }
    };

    return (
        <DashboardShell title="Career Journey" noScroll>
            <div className="h-full flex flex-col gap-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Timeline Milestones</h2>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">Manage your professional background</p>
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-mint text-theme-dark font-black rounded-2xl hover:scale-105 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                        Add Milestone
                    </button>
                </div>

                {/* Timeline List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-white/5 rounded-[1.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                            <Briefcase className="w-16 h-16 mb-6" />
                            <h3 className="text-xl font-bold">Your journey is a blank slate</h3>
                            <p className="text-sm">Add your first professional experience to start the timeline.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {experiences.map((exp, idx) => (
                                <motion.div
                                    layout
                                    key={exp.id}
                                    className="group bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center gap-6 hover:border-accent-mint/20 hover:bg-white/[0.04] transition-all duration-500"
                                >
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-10 h-10 rounded-xl bg-accent-mint/10 border border-accent-mint/20 flex items-center justify-center text-accent-mint font-black text-xs">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                                            <h3 className="text-base font-bold truncate">{exp.title}</h3>
                                            <div className="flex items-center gap-3 text-[10px] text-white/40 font-black uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3 text-accent-mint/50" /> {exp.company}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-accent-mint/50" /> {exp.date}</span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExperienceStatus(exp);
                                                    }}
                                                    className={clsx(
                                                        "ml-2 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border transition-all hover:scale-105",
                                                        exp.isActive !== false ? "text-accent-mint border-accent-mint/20 bg-accent-mint/5" : "text-red-500 border-red-500/20 bg-red-500/5"
                                                    )}
                                                >
                                                    {exp.isActive !== false ? "Live" : "Inactive"}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-muted line-clamp-1 mt-1 opacity-60">
                                            {exp.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:text-accent-mint"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="cursor-grab p-2 opacity-5 hover:opacity-100 transition-opacity">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
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
                                    {editingExp ? "Edit Milestone" : "Add Milestone"}
                                </h2>
                                <button onClick={resetForm} className="p-2 hover:bg-white/5 rounded-xl text-white/40">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Job Title / Qualification</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. Senior Frontend Engineer"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Company / Institute</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="e.g. Google, Stanford University"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Duration</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                placeholder="e.g. 2022 - Present"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Display Order</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                                placeholder="1, 2, 3..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Description</label>
                                        <textarea
                                            required
                                            rows={6}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-accent-mint/30 transition-colors resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your role and key achievements..."
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Journey Visibility</p>
                                            <p className="text-[8px] text-white/30 uppercase font-bold tracking-tight">Toggle whether this milestone appears on your public profile</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                            className={clsx(
                                                "px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all",
                                                formData.isActive ? "bg-accent-mint text-theme-dark" : "bg-red-500/20 text-red-500"
                                            )}
                                        >
                                            {formData.isActive ? "Visible" : "Hidden"}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-accent-mint text-theme-dark font-black rounded-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(51,214,159,0.2)]"
                                    >
                                        <Save className="w-5 h-5" />
                                        {editingExp ? "Update Milestone" : "Secure Milestone"}
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
