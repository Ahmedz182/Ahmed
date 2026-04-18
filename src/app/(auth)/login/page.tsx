"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { sileo } from 'sileo';

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/admin/dashboard");
        }
    }, [user, loading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // On success, router will push naturally through auth state effect, but we can fast-track
            router.push("/admin/dashboard");
        } catch (error: any) {
            console.error("Login failed:", error);
            sileo.error({ description: "Invalid Credentials or Login Failed." });
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || user) {
        return (
            <div className="min-h-screen bg-theme-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-mint" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen flex bg-theme-dark overflow-hidden font-sans text-white">
            {/* Background ambient gradient */}
            {/* Left Side: Branding & Info (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 relative z-10 flex-col items-start justify-center p-10 xl:p-16 border-r border-white/5 h-full">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-mint/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-deep-green/40 rounded-full blur-[96px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <a href="/" className="inline-flex items-center text-text-secondary hover:text-accent-mint transition-colors mb-8">
                        &larr; Return to Portfolio
                    </a>


                    <h1 className="text-4xl xl:text-5xl font-black tracking-tight mb-4 flex items-center gap-2">

                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(51,214,159,0.15)] flex items-center justify-center text-accent-mint ">
                            <ShieldCheck className="w-7 h-7" />
                        </div>    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-mint to-soft-mint">
                            Admin Portal
                        </span>
                    </h1>

                    <p className="text-base text-text-secondary max-w-md leading-relaxed mb-8">
                        Welcome to your secure command center. Manage your portfolio projects, engage with incoming inquiries, and track your analytics in real-time.
                    </p>

                    <div className="flex flex-col gap-4">
                        {[
                            "End-to-end encrypted connection",
                            "Real-time traffic and inquiry analytics",
                            "Seamless project management"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-accent-mint shadow-[0_0_10px_rgba(51,214,159,0.8)]" />
                                <span className="text-text-secondary font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-center justify-center p-6 h-full overflow-y-auto lg:overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 pointer-events-none" />

                {/* Mobile Return Link */}
                <a href="/" className="lg:hidden absolute top-8 left-8 text-sm text-text-secondary hover:text-accent-mint transition-colors">
                    &larr; Portfolio
                </a>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    <div className="text-center mb-8 lg:hidden">
                        <div className="w-14 h-14 rounded-2xl mx-auto bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(51,214,159,0.15)] flex items-center justify-center text-accent-mint mb-4">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Admin Access</h2>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2 hidden lg:block">Sign In</h2>
                            <p className="text-sm text-text-secondary">Please enter your credentials to proceed.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-text-secondary uppercase">Email Address</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-accent-mint" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-widest text-text-secondary uppercase">Password</label>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted transition-colors group-focus-within:text-accent-mint" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 rounded-xl bg-theme-dark/50 border border-white/10 text-white placeholder-text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent-mint/50 transition-all font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-mint transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-3.5 mt-6 rounded-xl bg-accent-mint hover:bg-soft-mint text-theme-dark font-bold text-base transition-all shadow-[0_0_30px_rgba(51,214,159,0.2)] hover:shadow-[0_0_40px_rgba(51,214,159,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? "Authenticating..." : (
                                    <>
                                        Secure Login
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
