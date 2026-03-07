"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdmin && <SplashScreen />}
            {!isAdmin && <Navbar />}
            {children}
            {!isAdmin && <Footer />}
        </>
    );
};
