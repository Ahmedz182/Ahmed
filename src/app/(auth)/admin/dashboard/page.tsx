"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Briefcase, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { sileo } from "sileo";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { format } from "date-fns";



export default function AdminDashboard() {
    const [stats, setStats] = useState({
        contacts: 0,
        hires: 0,
        projects: 0,
        unreadContacts: 0,
        pendingHires: 0
    });
    const [recentHires, setRecentHires] = useState<any[]>([]);

    useEffect(() => {
        // Stats for Contacts
        const unsubContacts = onSnapshot(collection(db, "contacts"), (snapshot) => {
            const all = snapshot.docs;
            setStats(prev => ({
                ...prev,
                contacts: all.length,
                unreadContacts: all.filter(doc => !doc.data().read).length
            }));
        });

        // Stats for Hires
        const unsubHires = onSnapshot(collection(db, "hires"), (snapshot) => {
            const all = snapshot.docs;
            setStats(prev => ({
                ...prev,
                hires: all.length,
                pendingHires: all.filter(doc => doc.data().status === "pending").length
            }));

            // Set recent hires for the right panel
            const recent = all
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                .slice(0, 3);
            setRecentHires(recent);
        });

        // Stats for Projects
        const unsubProjects = onSnapshot(collection(db, "projects"), (snapshot) => {
            setStats(prev => ({
                ...prev,
                projects: snapshot.docs.length
            }));
        });

        return () => {
            unsubContacts();
            unsubHires();
            unsubProjects();
        };
    }, []);



    const statCards = [
        {
            title: "Total Inquiries",
            value: stats.hires,
            label: `${stats.pendingHires} Pending`,
            icon: Briefcase,
            color: "text-accent-mint",
            link: "/admin/dashboard/hire-me"
        },
        {
            title: "Messages",
            value: stats.contacts,
            label: `${stats.unreadContacts} New`,
            icon: MessageSquare,
            color: "text-blue-400",
            link: "/admin/dashboard/contacts"
        },
        {
            title: "Live Projects",
            value: stats.projects,
            label: "Public Portfolio",
            icon: LayoutDashboard,
            color: "text-amber-400",
            link: "/admin/dashboard/projects"
        }
    ];

    return (
        <DashboardShell title="Overview">
            <div className="space-y-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-md hover:bg-white/[0.04] transition-all relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <h3 className="text-text-secondary font-bold text-xs uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">{stat.title}</h3>
                                    <span className="text-4xl font-black text-white">{stat.value}</span>
                                </div>
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between relative z-10">
                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg bg-white/5 ${stat.color}`}>
                                    {stat.label}
                                </span>
                                <Link href={stat.link} className="text-text-muted hover:text-white transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Accent Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Placeholder */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 min-h-[340px] flex items-center justify-center backdrop-blur-md shadow-2xl relative overflow-hidden"
                        >

                            <div className="text-center relative z-10">
                                <div className="w-20 h-20 rounded-full bg-accent-mint/5 border border-accent-mint/10 flex items-center justify-center mx-auto mb-6">
                                    <LayoutDashboard className="w-10 h-10 text-accent-mint opacity-40" />
                                </div>
                                <h4 className="font-bold text-lg mb-2 text-white/80">Growth Analytics</h4>
                                <p className="text-text-secondary text-sm max-w-xs mx-auto opacity-60">
                                    Detailed visualization of your site traffic and inquiry trends will be displayed here soon.
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* Recent Inquiries Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col backdrop-blur-3xl shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                <Users className="w-4 h-4 text-accent-mint" />
                                Recent Leads
                            </h3>
                            <Link href="/admin/dashboard/hire-me" className="text-[10px] font-black uppercase text-accent-mint hover:underline">
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4 flex-1">
                            {recentHires.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-12 text-center">
                                    <Briefcase className="w-10 h-10 mb-2" />
                                    <p className="text-xs font-bold">No recent leads</p>
                                </div>
                            ) : (
                                recentHires.map((req, i) => (
                                    <div key={req.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xs font-black truncate group-hover:text-accent-mint transition-colors">{req.name}</h4>
                                            <span className="text-[9px] font-bold text-text-muted opacity-50 uppercase" suppressHydrationWarning>
                                                {req.createdAt?.seconds ? format(new Date(req.createdAt.seconds * 1000), "HH:mm") : "..."}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-text-secondary px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                                                {req.projectType}
                                            </span>
                                            <span className="text-[10px] font-black text-accent-mint">{req.budget}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-5 mt-6 rounded-2xl bg-accent-mint/5 border border-accent-mint/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-accent-mint">System Status</p>
                                    <p className="text-[9px] text-accent-mint/70 font-bold">All services operational</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardShell>
    );
}

