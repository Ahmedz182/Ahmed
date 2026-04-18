"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Settings as SettingsIcon,
    Mail,
    Phone,
    Github,
    Linkedin,
    Twitter,
    Globe,
    Save,
    FileText,
    Upload,
    Loader2,
    Plus,
    X,
    Layers,
    Database,
    Wrench,
    Trash2,
    User as UserIcon,
    LogOut,
    Server,
    Key,
    Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { sileo } from "sileo";
import clsx from "clsx";

interface ContactInfo {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    twitter: string;
    location: string;
}

interface Skill {
    name: string;
    category: "Frontend" | "Backend" | "Tools";
}

interface EmailSettings {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    toEmail: string;
    enabled: boolean;
}

interface SiteSettings {
    contact: ContactInfo;
    techStack: Skill[];
    resumeUrl: string;
    email: EmailSettings;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"general" | "tech" | "profile">("profile");
    const { user } = useAuth();

    const [settings, setSettings] = useState<SiteSettings>({
        contact: {
            email: "ahmedfayyaz@portfolio.com",
            phone: "+92 300 1234567",
            github: "https://github.com/ahmed",
            linkedin: "https://linkedin.com/in/ahmed",
            twitter: "https://twitter.com/ahmed",
            location: "Lahore, Pakistan"
        },
        techStack: [
            { name: "React", category: "Frontend" },
            { name: "React Native", category: "Frontend" },
            { name: "Next.js", category: "Frontend" },
            { name: "JavaScript", category: "Frontend" },
            { name: "HTML5", category: "Frontend" },
            { name: "CSS3", category: "Frontend" },
            { name: "Tailwind CSS", category: "Frontend" },
            { name: "Node.js", category: "Backend" },
            { name: "Express.js", category: "Backend" },
            { name: "MongoDB", category: "Backend" },
            { name: "REST APIs", category: "Backend" },
            { name: "Django (learning)", category: "Backend" },
            { name: "Git", category: "Tools" },
            { name: "GitHub", category: "Tools" },
            { name: "Postman", category: "Tools" },
            { name: "Figma", category: "Tools" },
            { name: "WordPress", category: "Tools" },
            { name: "Webflow", category: "Tools" }
        ],
        resumeUrl: "",
        email: {
            smtpHost: "smtp.gmail.com",
            smtpPort: "465",
            smtpUser: "",
            smtpPass: "",
            fromEmail: "",
            toEmail: "",
            enabled: false
        }
    });

    const [newSkill, setNewSkill] = useState({ name: "", category: "Frontend" as Skill["category"] });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "metadata", "settings");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setSettings(docSnap.data() as SiteSettings);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                sileo.error({ description: "Failed to load dashboard settings." });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "metadata", "settings"), {
                ...settings,
                updatedAt: serverTimestamp()
            });
            sileo.success({ description: "Settings updated successfully!" });
        } catch (error) {
            console.error("Save error:", error);
            sileo.error({ description: "Failed to save settings." });
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (!newSkill.name.trim()) return;
        setSettings(prev => ({
            ...prev,
            techStack: [...prev.techStack, { ...newSkill }]
        }));
        setNewSkill({ name: "", category: newSkill.category });
    };

    const removeSkill = (name: string) => {
        setSettings(prev => ({
            ...prev,
            techStack: prev.techStack.filter(s => s.name !== name)
        }));
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            sileo.error({ description: "Failed to sign out." });
        }
    };

    if (loading) {
        return (
            <DashboardShell title="Settings">
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-accent-mint animate-spin opacity-20" />
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell title="System Configuration">
            <div className="max-w-4xl space-y-8 pb-20">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Tabs */}
                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 w-fit">
                        {[
                            { id: "profile", label: "Profile", icon: UserIcon },
                            { id: "general", label: "Contact Info", icon: Mail },
                            { id: "tech", label: "Tech Arsenal", icon: Layers },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    activeTab === tab.id
                                        ? "bg-accent-mint text-theme-dark shadow-lg"
                                        : "text-text-muted hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActiveTab("email" as any)}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                (activeTab as any) === "email"
                                    ? "bg-accent-mint text-theme-dark shadow-lg"
                                    : "text-text-muted hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Mail className="w-4 h-4" />
                            Email Config
                        </button>
                    </div>

                    {activeTab !== "profile" && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-accent-mint text-theme-dark font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-accent-mint/10 disabled:opacity-50 text-[10px] uppercase tracking-widest"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    )}
                </div>

                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-accent-mint/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-32 h-32 rounded-full border-2 border-accent-mint/30 p-2 relative z-10">
                                            {user?.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-accent-mint/10 flex items-center justify-center">
                                                    <UserIcon className="w-12 h-12 text-accent-mint" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black tracking-tight text-white">{user?.displayName || "Admin User"}</h2>
                                        <p className="text-text-muted font-medium">{user?.email}</p>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={handleSignOut}
                                            className="px-10 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-3xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-red-500/5 group"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Terminate Session
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "general" && (
                            <motion.div
                                key="general"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <SettingField
                                            label="Public Email"
                                            icon={Mail}
                                            value={settings.contact.email}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, email: v } })}
                                        />
                                        <SettingField
                                            label="Phone Number"
                                            icon={Phone}
                                            value={settings.contact.phone}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, phone: v } })}
                                        />
                                        <SettingField
                                            label="Location"
                                            icon={Globe}
                                            value={settings.contact.location}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, location: v } })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <SettingField
                                            label="GitHub Profile"
                                            icon={Github}
                                            value={settings.contact.github}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, github: v } })}
                                        />
                                        <SettingField
                                            label="LinkedIn URL"
                                            icon={Linkedin}
                                            value={settings.contact.linkedin}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, linkedin: v } })}
                                        />
                                        <SettingField
                                            label="Twitter / X"
                                            icon={Twitter}
                                            value={settings.contact.twitter}
                                            onChange={(v) => setSettings({ ...settings, contact: { ...settings.contact, twitter: v } })}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "tech" && (
                            <motion.div
                                key="tech"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Add Skill */}
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="text-[10px] font-black uppercase text-white/30 mb-2 block">Skill Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-mint/50 outline-none"
                                            placeholder="e.g. Docker"
                                            value={newSkill.name}
                                            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-48">
                                        <label className="text-[10px] font-black uppercase text-white/30 mb-2 block">Category</label>
                                        <select
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-mint/50 outline-none appearance-none cursor-pointer text-white"
                                            value={newSkill.category}
                                            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                                        >
                                            <option value="Frontend" className="bg-[#111]">Frontend</option>
                                            <option value="Backend" className="bg-[#111]">Backend</option>
                                            <option value="Tools" className="bg-[#111]">Tools & Workflow</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={addSkill}
                                        className="h-12 w-12 rounded-xl bg-accent-mint text-theme-dark flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Skills List */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {["Frontend", "Backend", "Tools"].map((cat) => (
                                        <div key={cat} className="space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-mint/60">
                                                {cat === "Frontend" ? <Layers className="w-3 h-3" /> : cat === "Backend" ? <Database className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                                                {cat}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {settings.techStack.filter(s => s.category === cat).map(skill => (
                                                    <span
                                                        key={skill.name}
                                                        className="pl-3 pr-1 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/80 flex items-center gap-2 group hover:border-red-500/30 transition-colors"
                                                    >
                                                        {skill.name}
                                                        <button
                                                            onClick={() => removeSkill(skill.name)}
                                                            className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                                {settings.techStack.filter(s => s.category === cat).length === 0 && (
                                                    <p className="text-[10px] italic text-white/20">No {cat.toLowerCase()} skills added</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {(activeTab as any) === "email" && (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-accent-mint/10 text-accent-mint flex items-center justify-center">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-white">SMTP Gateway</h3>
                                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Notification Engine Settings</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, email: { ...settings.email, enabled: !settings.email.enabled } })}
                                            className={clsx(
                                                "px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all",
                                                settings.email.enabled ? "bg-accent-mint text-theme-dark" : "bg-white/5 text-white/20 border border-white/5"
                                            )}
                                        >
                                            {settings.email.enabled ? "System Active" : "System Offline"}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-4">
                                            <SettingField label="SMTP Host" icon={Server} value={settings.email.smtpHost} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, smtpHost: v } })} />
                                            <SettingField label="SMTP Port" icon={Globe} value={settings.email.smtpPort} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, smtpPort: v } })} />
                                            <SettingField label="SMTP User" icon={Mail} value={settings.email.smtpUser} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, smtpUser: v } })} />
                                            <SettingField label="SMTP Pass / App Password" icon={Key} value={settings.email.smtpPass} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, smtpPass: v } })} />
                                        </div>
                                        <div className="space-y-4">
                                            <SettingField label="Sender Email" icon={Send} value={settings.email.fromEmail} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, fromEmail: v } })} />
                                            <SettingField label="Recipient Email" icon={Mail} value={settings.email.toEmail} onChange={(v) => setSettings({ ...settings, email: { ...settings.email, toEmail: v } })} />
                                            
                                            <div className="p-6 bg-accent-mint/5 border border-accent-mint/10 rounded-3xl mt-6">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-accent-mint mb-2">Security Note</p>
                                                <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                                                    Use an **App Password** for Gmail or Outlook. Do not use your primary password. The system will alert you when new leads arrive.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardShell>
    );
}

function SettingField({ label, icon: Icon, value, onChange }: { label: string, icon: any, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-mint/40" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-12 py-4 text-sm focus:border-accent-mint/50 focus:bg-white/[0.05] outline-none transition-all"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    );
}
