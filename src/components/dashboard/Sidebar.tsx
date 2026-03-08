"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, MessageSquare, Briefcase, Settings, X, User as UserIcon, LayoutGrid, Rocket, FileText, PenTool } from "lucide-react";
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
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
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
            label: "Blogs",
            description: "Write Stories",
            href: "/admin/dashboard/blogs",
            icon: PenTool,
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
                "fixed md:sticky top-0 md:top-6 left-0 md:left-6 h-full md:h-[calc(100vh-48px)] flex z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#080808] border-r md:border border-white/5 md:rounded-[2rem] shadow-2xl",
                isOpen ? "w-[280px] translate-x-0" : "w-[0] md:w-[64px] -translate-x-full md:translate-x-0"
            )}>
                {/* Mobile Close Button */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute -right-14 top-6 p-3 rounded-2xl bg-[#080808] border border-white/10 text-white md:hidden backdrop-blur-md shadow-2xl"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Content Container */}
                <div className={clsx(
                    "w-full flex flex-col py-6 overflow-hidden",
                    !isOpen && "md:items-center px-2",
                    isOpen && "px-4"
                )}>
                    {/* Brand/Logo Section (visible when open) */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-4 px-3 mb-10"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-accent-mint flex items-center justify-center shadow-[0_0_20px_rgba(51,214,159,0.3)]">
                                    <PenTool className="w-5 h-5 text-theme-dark" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-black text-white uppercase tracking-widest text-xs truncate">Admin</h2>
                                    <p className="text-[10px] text-accent-mint font-bold uppercase tracking-tight truncate">Management</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Nav Icons */}
                    <nav className="flex-1 w-full space-y-1.5 overflow-y-auto scrollbar-hide no-scrollbar">
                        {navItems.map((item) => {
                            const isActive = item.href === "/admin/dashboard"
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        "w-full flex items-center rounded-2xl transition-all duration-300 relative group",
                                        isOpen ? "px-4 py-3 gap-4" : "h-[48px] px-0 justify-center",
                                        isActive
                                            ? "bg-white/5 text-accent-mint shadow-inner"
                                            : "text-text-muted hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <div className="relative flex items-center justify-center">
                                        <Icon className={clsx(
                                            "w-[18px] h-[18px] transition-transform duration-300",
                                            isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(51,214,159,0.5)]" : "group-hover:scale-110"
                                        )} />

                                        {item.badge > 0 && !isOpen && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(51,214,159,0.8)] z-10 animate-pulse border-2 border-[#080808]" />
                                        )}
                                    </div>

                                    {isOpen && (
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-xs whitespace-nowrap">{item.label}</p>
                                            <p className="text-[10px] text-text-muted whitespace-nowrap truncate">{item.description}</p>
                                        </div>
                                    )}

                                    {item.badge > 0 && isOpen && (
                                        <span className="px-2 py-0.5 rounded-lg bg-accent-mint/10 text-accent-mint text-[10px] font-black">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Link indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute -left-2 w-1 h-6 bg-accent-mint rounded-r-full shadow-[0_0_10px_rgba(51,214,159,0.5)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section - Sign Out */}
                    <div className={clsx("mt-auto w-full pt-4", isOpen ? "px-2" : "px-0")}>
                        <button
                            onClick={handleSignOut}
                            className={clsx(
                                "w-full rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center transition-all group relative",
                                isOpen ? "px-4 py-3.5 gap-4 hover:bg-red-500 hover:text-white" : "h-[48px] justify-center hover:bg-red-500/10 hover:text-red-500 text-red-400/50"
                            )}
                            title="Sign Out"
                        >
                            <LogOut className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                            {isOpen && (
                                <div className="text-left">
                                    <p className="font-black text-[10px] uppercase tracking-widest">Terminate</p>
                                    <p className="text-[10px] opacity-60">Close Session</p>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
