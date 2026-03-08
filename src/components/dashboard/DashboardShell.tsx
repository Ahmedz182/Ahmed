"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface DashboardShellProps {
    children: React.ReactNode;
    title?: string;
    noScroll?: boolean;
}

export function DashboardShell({ children, title = "Overview", noScroll = false }: DashboardShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans flex text-sm transition-all duration-300">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-14 border-b border-white/5 bg-[#030303]/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 hover:bg-white/5 rounded-lg text-text-secondary"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <h2 className="text-base font-bold text-white/80">{title}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/30 hidden sm:inline-block">Admin Portal</span>
                            <div className="w-8 h-8 rounded-full bg-accent-mint/10 border border-accent-mint/20 flex items-center justify-center text-accent-mint text-xs font-black shadow-[0_0_15px_rgba(51,214,159,0.1)]">
                                AF
                            </div>
                        </div>
                    </div>
                </header>

                <div className={clsx(
                    "flex-1 relative z-20 custom-scrollbar p-4 md:p-6",
                    noScroll ? "overflow-hidden h-full" : "overflow-y-auto"
                )}>
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none z-0" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-mint/5 rounded-full blur-[140px] pointer-events-none z-0" />

                    <div className={clsx(
                        "max-w-[1400px] mx-auto relative z-10 px-0 md:px-2",
                        noScroll && "h-full"
                    )}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className={clsx(noScroll && "h-full")}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
