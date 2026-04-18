"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Briefcase, Calendar, User, Mail, Phone, Box, DollarSign, Clock, Trash2, CheckCircle, ExternalLink, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import { format } from "date-fns";
import clsx from "clsx";

interface HireRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    budget: string;
    projectType: string;
    details: string;
    referenceLinks: string;
    bookCall: boolean;
    status: "pending" | "reviewing" | "completed";
    createdAt: any;
}

export default function HireMePage() {
    const [requests, setRequests] = useState<HireRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<HireRequest | null>(null);

    useEffect(() => {
        const q = query(collection(db, "hires"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as HireRequest));
            setRequests(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching hire requests:", error);
            sileo.error({ description: "Failed to fetch hire requests." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (id: string, status: HireRequest["status"]) => {
        try {
            await updateDoc(doc(db, "hires", id), { status });
            sileo.success({ description: `Status updated to ${status}.` });
            // Update local state if it's the selected one
            if (selectedRequest?.id === id) {
                setSelectedRequest({ ...selectedRequest, status });
            }
        } catch (error) {
            sileo.error({ description: "Failed to update status." });
        }
    };

    const deleteRequest = async (id: string) => {
        try {
            await deleteDoc(doc(db, "hires", id));
            sileo.success({ description: "Request deleted." });
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (error) {
            sileo.error({ description: "Error deleting request." });
        }
    };

    return (
        <DashboardShell title="Hire Me Inquiries" noScroll>
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 h-full overflow-hidden relative">
                {/* List View */}
                <div className={clsx(
                    "lg:col-span-3 h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden",
                    selectedRequest ? "hidden lg:flex" : "flex"
                )}>
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <h3 className="font-black flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                            Recent Leads
                        </h3>
                        <span className="text-[9px] bg-accent-mint/10 text-accent-mint px-2 py-0.5 rounded-md font-black">
                            {requests.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)
                        ) : requests.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-12 text-center p-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 mx-auto">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-widest">No inquiries yet</p>
                            </div>
                        ) : (
                            requests.map((req) => (
                                <motion.div
                                    layout
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className={clsx(
                                        "p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden",
                                        selectedRequest?.id === req.id
                                            ? "bg-accent-mint/10 border-accent-mint/20 shadow-[0_4px_20px_rgba(51,214,159,0.05)]"
                                            : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={clsx(
                                            "text-xs font-bold truncate pr-2",
                                            selectedRequest?.id === req.id ? "text-accent-mint" : "text-white/90"
                                        )}>{req.name}</span>
                                        <div className={clsx(
                                            "text-[8px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-widest",
                                            req.status === "completed" ? "bg-green-500/10 text-green-400" :
                                                req.status === "reviewing" ? "bg-blue-500/10 text-blue-400" : "bg-accent-mint/10 text-accent-mint"
                                        )}>
                                            {req.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-text-muted mb-3 opacity-60">
                                        <span className="flex items-center gap-1"><Box className="w-2.5 h-2.5" /> {req.projectType}</span>
                                        <span className="opacity-20">|</span>
                                        <span className="flex items-center gap-1"><DollarSign className="w-2.5 h-2.5" /> {req.budget || "N/A"}</span>
                                    </div>
                                    <div className="text-[9px] text-white/30 font-bold uppercase tracking-tighter" suppressHydrationWarning>
                                        {req.createdAt?.toDate ? format(req.createdAt.toDate(), "MMM d, HH:mm") : "..."}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className={clsx(
                    "lg:col-span-9 h-full bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden relative backdrop-blur-sm",
                    !selectedRequest ? "hidden lg:flex" : "flex"
                )}>
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="h-full overflow-y-auto flex flex-col pt-10 px-10 pb-12 custom-scrollbar"
                            >
                                {/* Mobile Back Button */}
                                <div className="lg:hidden mb-8">
                                    <button
                                        onClick={() => setSelectedRequest(null)}
                                        className="text-accent-mint text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-accent-mint/10 px-5 py-2.5 rounded-2xl border border-accent-mint/20 shadow-lg shadow-accent-mint/5"
                                    >
                                        &larr; Back to Leads
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    {/* Compact Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-mint/5 rounded-full border border-accent-mint/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-mint">
                                                    Inquiry Detected
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tighter text-white leading-none">{selectedRequest.name}</h2>

                                            <div className="flex flex-wrap items-center gap-5 text-xs text-text-muted font-medium">
                                                <a href={`mailto:${selectedRequest.email}`} className="flex items-center gap-2 hover:text-accent-mint transition-colors group">
                                                    <Mail className="w-3.5 h-3.5 text-accent-mint/40 group-hover:text-accent-mint" /> {selectedRequest.email}
                                                </a>
                                                {selectedRequest.phone && (
                                                    <a href={`tel:${selectedRequest.phone}`} className="flex items-center gap-2 hover:text-accent-mint transition-colors group">
                                                        <Phone className="w-3.5 h-3.5 text-accent-mint/40 group-hover:text-accent-mint" /> {selectedRequest.phone}
                                                    </a>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-accent-mint/40" />
                                                    <span suppressHydrationWarning className="text-[11px]">{selectedRequest.createdAt?.toDate ? format(selectedRequest.createdAt.toDate(), "MMMM dd, yyyy") : "Processing..."}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 pt-1">
                                                <div className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2.5">
                                                    <Box className="w-3.5 h-3.5 text-accent-mint/60" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedRequest.projectType}</span>
                                                </div>
                                                <div className="px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2.5">
                                                    <DollarSign className="w-3.5 h-3.5 text-accent-mint/60" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedRequest.budget || "N/A"}</span>
                                                </div>
                                                <a
                                                    href={`mailto:${selectedRequest.email}?subject=Collaboration Discussion - ${selectedRequest.projectType}`}
                                                    className="px-5 py-1.5 bg-accent-mint text-theme-dark font-black rounded-xl hover:scale-[1.05] transition-all flex items-center gap-2 shadow-lg shadow-accent-mint/10 text-[10px] uppercase tracking-widest"
                                                >
                                                    Initiate Discussion
                                                    <CheckCircle className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 shrink-0">
                                            <div className="flex gap-2">
                                                <div className="relative group/select">
                                                    <select
                                                        value={selectedRequest.status}
                                                        onChange={(e) => updateStatus(selectedRequest.id, e.target.value as any)}
                                                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-accent-mint/20 cursor-pointer hover:bg-white/10 transition-all text-white min-w-[130px]"
                                                    >
                                                        <option value="pending" className="bg-theme-dark">Pending</option>
                                                        <option value="reviewing" className="bg-theme-dark">Reviewing</option>
                                                        <option value="completed" className="bg-theme-dark">Completed</option>
                                                    </select>
                                                    <ChevronRight className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none opacity-40" />
                                                </div>
                                                <button
                                                    onClick={() => deleteRequest(selectedRequest.id)}
                                                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group"
                                                >
                                                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                            {selectedRequest.bookCall && (
                                                <div className="bg-accent-mint/10 text-accent-mint border border-accent-mint/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-center flex items-center gap-2 justify-center">
                                                    <Clock className="w-3 h-3" /> Call Requested
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Flow */}
                                    <div className="space-y-8 pt-4">
                                        <div className="space-y-4">
                                            <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-mint/30 ml-1">Inquiry Brief</h4>
                                            <div className="relative">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-accent-mint/5 rounded-full" />
                                                <div className="pl-6">
                                                    <p className="text-base leading-relaxed text-white/60 whitespace-pre-wrap font-medium">
                                                        {selectedRequest.details}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedRequest.referenceLinks && (
                                            <div className="space-y-4">
                                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-accent-mint/30 ml-1">Strategic Assets</h4>
                                                <div className="pl-1">
                                                    <a
                                                        href={selectedRequest.referenceLinks}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/[0.02] rounded-xl border border-white/5 hover:border-accent-mint/30 hover:bg-accent-mint/5 transition-all group"
                                                    >
                                                        <ExternalLink className="w-4 h-4 text-accent-mint" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">External Assets</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 overflow-hidden">

                                <div className="relative z-10 space-y-4">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform duration-500">
                                        <Box className="w-8 h-8 text-accent-mint opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Select lead to review</h3>
                                    <p className="max-w-[240px] mx-auto text-[11px] text-text-muted opacity-60 leading-relaxed font-bold">
                                        Full technical requirements, contact info, and budget constraints will appear here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardShell>
    );
}
