"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, MessageSquare, Briefcase, Settings, X, User as UserIcon, ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, Rocket, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import clsx from "clsx";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const [unreadContacts, setUnreadContacts] = useState(0);
    const [pendingHires, setPendingHires] = useState(0);

    useEffect(() => {
        const unsubContacts = onSnapshot(collection(db, "contacts"), (snapshot) => {
            setUnreadContacts(snapshot.docs.filter(doc => !doc.data().read).length);
        });

        const unsubHires = onSnapshot(collection(db, "hires"), (snapshot) => {
            setPendingHires(snapshot.docs.filter(doc => doc.data().status === "pending").length);
        });

        return () => {
            unsubContacts();
            unsubHires();
        };
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const navItems = [
        {
            label: "Dashboard",
            description: "Main Overview",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            badge: 0
        },
        {
            label: "Projects",
            description: "Manage Portfolio",
            href: "/admin/dashboard/projects",
            icon: LayoutGrid,
            badge: 0
        },
        {
            label: "Experience",
            description: "Career Journey",
            href: "/admin/dashboard/experience",
            icon: Rocket,
            badge: 0
        },
        {
            label: "Contacts",
            description: "View Messages",
            href: "/admin/dashboard/contacts",
            icon: MessageSquare,
            badge: unreadContacts
        },
        {
            label: "Hire me's",
            description: "Work Requests",
            href: "/admin/dashboard/hire-me",
            icon: Briefcase,
            badge: pendingHires
        },
        {
            label: "Resume",
            description: "Career Assets",
            href: "/admin/dashboard/resume",
            icon: FileText,
            badge: 0
        },
        {
            label: "Settings",
            description: "System Config",
            href: "/admin/dashboard/settings",
            icon: Settings,
            badge: 0
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={clsx(
                "fixed md:sticky top-0 left-0 h-screen flex z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:translate-x-0 bg-[#050505]",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "md:w-[72px]" : "md:w-64"
            )}>

                {/* Deskop Edge Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-16 w-7 h-7 bg-accent-mint text-theme-dark rounded-full hidden md:flex items-center justify-center border-4 border-[#030303] z-[60] hover:scale-110 transition-transform shadow-[0_0_15px_rgba(51,214,159,0.3)]"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Left Rail - Always visible on desktop */}
                <div className="w-[72px] flex flex-col items-center py-6 border-r border-white/5 shrink-0 bg-[#080808]">
                    {/* Logo Section */}
                    <Link href="/admin/dashboard" className="mb-10 group">
                        <div className="w-10 h-10 rounded-xl bg-accent-mint/10 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                            <div className="absolute inset-0 bg-accent-mint/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-lg font-black text-accent-mint relative z-10">AF</span>
                        </div>
                    </Link>

                    {/* Nav Icons */}
                    <nav className="flex-1 w-full px-3 space-y-3">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => isCollapsed ? null : setIsOpen(false)}
                                    className={clsx(
                                        "w-full aspect-square flex items-center justify-center rounded-xl transition-all duration-300 relative group",
                                        isActive
                                            ? "bg-white/5 text-accent-mint shadow-inner"
                                            : "text-text-muted hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {/* Active Indicator Glow */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute -left-3 w-1.5 h-6 bg-accent-mint rounded-r-full shadow-[0_0_15px_rgba(51,214,159,0.5)]"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Notification Dot */}
                                    {item.badge > 0 && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(51,214,159,0.8)] z-10 animate-pulse border-2 border-[#080808]" />
                                    )}

                                    <Icon className={clsx(
                                        "w-5 h-5 transition-transform duration-300",
                                        isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(51,214,159,0.5)]" : "group-hover:scale-110"
                                    )} />

                                    {/* Tooltip for Collapsed State */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-theme-dark border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 transition-all z-[100] shadow-2xl">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section - User Avatar */}
                    <div className="mt-auto px-3 w-full">
                        <button
                            className="w-full aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden hover:border-accent-mint/50 transition-colors group relative"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Admin" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-5 h-5 text-accent-mint" />
                            )}
                            <div className="absolute inset-0 bg-accent-mint/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Right Panel - Expandable */}
                <div className={clsx(
                    "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                    isCollapsed ? "md:w-0 md:opacity-0 md:pointer-events-none" : "w-full opacity-100"
                )}>
                    <div className="h-20 flex items-center px-6 border-b border-white/5">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-text-muted">Navigation</h3>
                        <button
                            className="ml-auto md:hidden p-2 hover:bg-white/5 rounded-lg text-text-secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 py-8 px-6 space-y-8">
                        <div>
                            <div className="space-y-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={clsx(
                                                "flex flex-col group transition-colors",
                                                isActive ? "text-white" : "text-text-secondary hover:text-white"
                                            )}
                                        >
                                            <span className="text-sm font-bold mb-0.5 flex items-center gap-2">
                                                {item.label}
                                                {item.badge > 0 && (
                                                    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-accent-mint text-theme-dark text-[10px] font-black rounded-lg">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {isActive && <div className="w-1 h-1 rounded-full bg-accent-mint" />}
                                            </span>
                                            <span className="text-[11px] text-text-muted font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                                                {item.description}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Profile Detail at bottom of panel */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-white" suppressHydrationWarning>Ahmed Fayyaz</p>
                                <p className="text-[11px] text-text-muted truncate opacity-60" suppressHydrationWarning>{user?.email || "admin@portfolio.com"}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-all group border border-red-500/10"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
