"use client";

import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, MessageSquare, Files, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-theme-dark text-white font-sans flex text-sm">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-theme-dark/50 backdrop-blur-md flex-col hidden md:flex z-20">
                <div className="h-20 flex items-center px-8 border-b border-white/10 shrink-0">
                    <span className="text-xl font-bold tracking-tighter">AF <span className="text-accent-mint">ADMIN</span></span>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-mint/10 text-accent-mint font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white font-medium transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        Messages
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white font-medium transition-colors">
                        <Files className="w-5 h-5" />
                        Projects
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-text-secondary hover:text-white font-medium transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 shrink-0">
                    <button
                        onClick={() => window.location.href = "/admin/login"}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-text-secondary hover:text-red-400 font-medium transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-20 border-b border-white/10 bg-theme-dark/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-20">
                    <h2 className="text-lg font-bold">Overview</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-text-secondary font-medium hidden sm:inline-block">Welcome back, Admin</span>
                            <div className="w-10 h-10 rounded-full bg-accent-mint/20 border border-accent-mint/30 flex items-center justify-center text-accent-mint font-bold shadow-[0_0_10px_rgba(51,214,159,0.2)]">
                                AF
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-mint/5 rounded-full blur-[128px] pointer-events-none z-0" />

                    <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: "Total Views", value: "12,405", trend: "+14%" },
                                { title: "Project Inquiries", value: "48", trend: "+5%" },
                                { title: "Messages", value: "12", trend: "-2%" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl backdrop-blur-md hover:bg-white/[0.04] transition-colors"
                                >
                                    <h3 className="text-text-secondary font-medium mb-2 opacity-80">{stat.title}</h3>
                                    <div className="flex items-end justify-between">
                                        <span className="text-3xl font-bold text-white">{stat.value}</span>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${stat.trend.startsWith("+") ? "bg-accent-mint/10 text-accent-mint" : "bg-red-500/10 text-red-400"}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="lg:col-span-2 p-8 rounded-2xl bg-white/[0.02] border border-white/10 min-h-[400px] flex px-4 items-center justify-center backdrop-blur-md shadow-xl"
                            >
                                <div className="text-center text-text-secondary">
                                    <LayoutDashboard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Dashboard charts will actively render here.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 min-h-[400px] flex flex-col backdrop-blur-md shadow-xl"
                            >
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-accent-mint" />
                                    Recent Inquiries
                                </h3>

                                <div className="space-y-4 flex-1">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium group-hover:text-accent-mint transition-colors">Client {i}</h4>
                                                <span className="text-xs text-text-muted">2h ago</span>
                                            </div>
                                            <p className="text-xs text-text-secondary line-clamp-1">Looking for a Next.js developer for a new SaaS product...</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                                    View All
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
