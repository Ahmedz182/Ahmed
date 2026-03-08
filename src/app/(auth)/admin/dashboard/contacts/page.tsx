"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MessageSquare, Calendar, User, Mail, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import { format } from "date-fns";
import clsx from "clsx";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: any;
}

export default function ContactsPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ContactMessage));
            setMessages(msgs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages:", error);
            sileo.error({ description: "Failed to fetch messages. Please check permissions." });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const markAsRead = async (msg: ContactMessage) => {
        if (msg.read) return;
        try {
            await updateDoc(doc(db, "contacts", msg.id), {
                read: true
            });
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const toggleReadStatus = async (msg: ContactMessage) => {
        try {
            await updateDoc(doc(db, "contacts", msg.id), {
                read: !msg.read
            });
            if (!msg.read && selectedMessage?.id === msg.id) {
                setSelectedMessage({ ...selectedMessage, read: true });
            }
        } catch (error) {
            sileo.error({ description: "Failed to update message status." });
        }
    };

    const deleteMessage = async (id: string) => {
        // Confirmation could be added here, but for brevity using simple delete
        try {
            await deleteDoc(doc(db, "contacts", id));
            sileo.success({ description: "Message deleted successfully." });
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            sileo.error({ description: "Error deleting message." });
        }
    };

    return (
        <DashboardShell title="Inbound Messages" noScroll>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full overflow-hidden">
                {/* Messages List */}
                <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <h3 className="font-black flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                            Inbox
                        </h3>
                        <span className="text-[9px] bg-accent-mint/10 text-accent-mint px-2 py-0.5 rounded-md font-black">
                            {messages.filter(m => !m.read).length} New
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {loading ? (
                            Array(8).fill(0).map((_, i) => (
                                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                            ))
                        ) : messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-12 text-center p-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 mx-auto">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-widest">No messages yet</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        markAsRead(msg);
                                    }}
                                    className={clsx(
                                        "p-4 rounded-xl cursor-pointer transition-all border group relative overflow-hidden",
                                        selectedMessage?.id === msg.id
                                            ? "bg-accent-mint/10 border-accent-mint/20 shadow-[0_4px_20px_rgba(51,214,159,0.05)]"
                                            : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                                    )}
                                >
                                    {/* Unread dot - positioned better */}
                                    {!msg.read && (
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent-mint shadow-[0_0_10px_rgba(51,214,159,0.8)] z-10" />
                                    )}

                                    <div className="flex flex-col gap-1 relative z-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className={clsx(
                                                "text-xs font-bold truncate",
                                                !msg.read ? "text-white" : "text-text-muted"
                                            )}>{msg.name}</span>
                                            <span className="text-[9px] text-text-muted font-bold opacity-50" suppressHydrationWarning>
                                                {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), "HH:mm") : "..."}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-text-muted truncate line-clamp-1 opacity-60">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Details */}
                <div className="lg:col-span-9 h-full flex flex-col bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <div className="p-6 border-b border-white/5">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-accent-mint/10 flex items-center justify-center border border-accent-mint/20">
                                                <User className="w-6 h-6 text-accent-mint" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                                                <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedMessage.email}</span>
                                                    <span className="opacity-20">|</span>
                                                    <span className="flex items-center gap-1.5" suppressHydrationWarning><Calendar className="w-3.5 h-3.5" /> {selectedMessage.createdAt?.toDate ? format(selectedMessage.createdAt.toDate(), "PPP p") : "Pending..."}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleReadStatus(selectedMessage)}
                                                className={clsx(
                                                    "p-2.5 rounded-xl transition-all border",
                                                    selectedMessage.read
                                                        ? "bg-white/5 border-white/10 text-text-muted hover:text-white"
                                                        : "bg-accent-mint/10 border-accent-mint/30 text-accent-mint hover:bg-accent-mint/20"
                                                )}
                                                title={selectedMessage.read ? "Mark as Unread" : "Mark as Read"}
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(selectedMessage.id)}
                                                className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
                                                title="Delete Message"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-accent-mint/20 rounded-full" />
                                            <p className="pl-6 text-sm leading-relaxed text-text-secondary whitespace-pre-wrap font-medium">
                                                {selectedMessage.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto p-6 bg-black/20">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 opacity-50">Quick Actions</h4>
                                    <div className="flex gap-3">
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="px-6 py-3 bg-accent-mint text-theme-dark font-black rounded-xl hover:scale-105 transition-transform"
                                        >
                                            Reply via Email
                                        </a>
                                        <button className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">
                                            Archive Message
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
                                <div className="relative z-10 space-y-4">
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform duration-500">
                                        <MessageSquare className="w-8 h-8 text-accent-mint opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40">Select a thread</h3>
                                    <p className="max-w-[240px] mx-auto text-[11px] text-text-muted opacity-60 leading-relaxed font-bold">
                                        Choose a message from the sidebar to view the full conversation and reply.
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
