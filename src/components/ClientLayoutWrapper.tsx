"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollToTop } from "@/components/ScrollToTop";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdmin && <SplashScreen />}
            {!isAdmin && <Navbar />}
            {!isAdmin && <WhatsAppButton />}
            {!isAdmin && <ScrollToTop />}
            {children}
            {!isAdmin && <Footer />}
        </>
    );
};
