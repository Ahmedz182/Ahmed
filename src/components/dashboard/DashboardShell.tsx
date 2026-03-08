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

    return (
        <div className="min-h-screen bg-[#030303] text-white font-sans flex text-sm transition-all duration-300">
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-6 sticky top-0 bg-[#030303]/80 backdrop-blur-md z-30 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-black uppercase tracking-[0.2em] text-accent-mint/80">{title}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-accent-mint/10 border border-accent-mint/20 flex items-center justify-center">
                            <span className="text-xs font-black text-accent-mint uppercase">
                                {title.substring(0, 2)}
                            </span>
                        </div>
                    </div>
                </header>

                <div className={clsx(
                    "flex-1 relative z-20 custom-scrollbar p-6",
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
