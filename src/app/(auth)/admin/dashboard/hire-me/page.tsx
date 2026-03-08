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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full overflow-hidden">
                {/* List View */}
                <div className="lg:col-span-3 h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
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
                <div className="lg:col-span-9 h-full bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col relative">
                    <AnimatePresence mode="wait">
                        {selectedRequest ? (
                            <motion.div
                                key={selectedRequest.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full flex flex-col"
                            >
                                <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-3">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-mint/10 rounded-full border border-accent-mint/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">
                                                    Project Inquiry
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-black tracking-tight">{selectedRequest.name}</h2>

                                            <div className="flex flex-wrap gap-4 text-sm text-text-secondary pr-4">
                                                <a href={`mailto:${selectedRequest.email}`} className="flex items-center gap-2 hover:text-accent-mint transition-colors">
                                                    <Mail className="w-4 h-4" /> {selectedRequest.email}
                                                </a>
                                                {selectedRequest.phone && (
                                                    <a href={`tel:${selectedRequest.phone}`} className="flex items-center gap-2 hover:text-accent-mint transition-colors">
                                                        <Phone className="w-4 h-4" /> {selectedRequest.phone}
                                                    </a>
                                                )}
                                                <div className="flex items-center gap-2" suppressHydrationWarning>
                                                    <Calendar className="w-4 h-4" />
                                                    {selectedRequest.createdAt?.toDate ? format(selectedRequest.createdAt.toDate(), "PPP") : "Pending..."}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                                                    <Box className="w-3.5 h-3.5 text-accent-mint" />
                                                    <span className="text-xs font-bold">{selectedRequest.projectType}</span>
                                                </div>
                                                <div className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                                                    <DollarSign className="w-3.5 h-3.5 text-accent-mint" />
                                                    <span className="text-xs font-bold">{selectedRequest.budget || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 shrink-0">
                                            <div className="flex gap-2">
                                                <div className="relative group/select">
                                                    <select
                                                        value={selectedRequest.status}
                                                        onChange={(e) => updateStatus(selectedRequest.id, e.target.value as any)}
                                                        className="appearance-none bg-[#111] border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent-mint/50 cursor-pointer hover:bg-white/5 transition-colors text-white"
                                                    >
                                                        <option value="pending" className="bg-[#111]">Pending</option>
                                                        <option value="reviewing" className="bg-[#111]">Reviewing</option>
                                                        <option value="completed" className="bg-[#111]">Completed</option>
                                                    </select>
                                                    <ChevronRight className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none opacity-40" />
                                                </div>
                                                <button
                                                    onClick={() => deleteRequest(selectedRequest.id)}
                                                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {selectedRequest.bookCall && (
                                                <div className="bg-accent-mint text-theme-dark px-3 py-2 rounded-xl text-[10px] font-black uppercase text-center flex items-center gap-2 justify-center">
                                                    <Clock className="w-3 h-3" /> Call Requested
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Inquiry Brief</h4>
                                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap font-medium">
                                                    {selectedRequest.details}
                                                </p>
                                            </div>
                                        </div>

                                        {selectedRequest.referenceLinks && (
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Reference Assets</h4>
                                                <div className="flex gap-4">
                                                    <a
                                                        href={selectedRequest.referenceLinks}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5 text-accent-mint" />
                                                        <span className="text-xs font-bold">View Reference</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4">
                                    <a
                                        href={`mailto:${selectedRequest.email}?subject=Project inquiry - ${selectedRequest.projectType}`}
                                        className="flex-1 py-4 bg-accent-mint text-theme-dark font-black rounded-2xl hover:scale-[1.02] transition-transform text-center flex items-center justify-center gap-2"
                                    >
                                        Initiate Discussion
                                        <CheckCircle className="w-5 h-5" />
                                    </a>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
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
