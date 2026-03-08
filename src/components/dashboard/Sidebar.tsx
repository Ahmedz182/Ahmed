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
                "fixed md:sticky top-4 left-4 h-[calc(100vh-32px)] flex z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:translate-x-0 bg-[#080808] border border-white/5 shadow-2xl rounded-[2.5rem] w-[72px]",
                isOpen ? "translate-x-0" : "-translate-x-[calc(100%+16px)] md:translate-x-0"
            )}>
                {/* Fixed Rail Only */}
                <div className="w-full flex flex-col items-center py-6">
                    {/* Nav Icons */}
                    <nav className="flex-1 w-full px-3 space-y-2">
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
                                        "w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-300 relative group",
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
                                        "w-[18px] h-[18px] transition-transform duration-300",
                                        isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(51,214,159,0.5)]" : "group-hover:scale-110"
                                    )} />

                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-theme-dark border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 transition-all z-[100] shadow-2xl">
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section - Sign Out */}
                    <div className="mt-auto px-3 w-full pb-4">
                        <button
                            onClick={handleSignOut}
                            className="w-full aspect-square rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-red-400/50 transition-all group relative"
                            title="Sign Out"
                        >
                            <LogOut className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
