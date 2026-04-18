import React from 'react';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

export function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{title}</h3>
        </div>
    );
}

export function BuilderInput({ label, value, onChange, Icon, placeholder }: { label: string; value: string; onChange: (v: string) => void; Icon?: LucideIcon; placeholder?: string }) {
    return (
        <div className="space-y-2 flex-1 group">
            <label className="text-[9px] font-black uppercase text-white/20 ml-2 group-focus-within:text-accent-mint/60 transition-colors">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />}
                <input
                    type="text"
                    className={clsx(
                        "w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3.5 text-sm outline-none transition-all focus:border-accent-mint/30 focus:bg-white/[0.04] text-white/80",
                        Icon ? "pl-11 pr-5" : "px-5"
                    )}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}

export function ActionButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: LucideIcon; label: string }) {
    return (
        <button onClick={onClick} className={clsx(
            "flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            active ? "bg-accent-mint text-theme-dark shadow-xl" : "text-text-muted hover:text-white"
        )}>
            <Icon className="w-4 h-4" /> {label}
        </button>
    );
}

export function DashboardLoader() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-theme-dark gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Booting Career Workspace</span>
        </div>
    );
}
