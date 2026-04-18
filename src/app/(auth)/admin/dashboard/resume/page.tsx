"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    FileText,
    Plus,
    Trash2,
    Save,
    Upload,
    Loader2,
    ExternalLink,
    Briefcase,
    GraduationCap,
    Trophy,
    User,
    Calendar,
    Globe,
    Github,
    Linkedin,
    Code2,
    Wrench,
    Search,
    Download,
    Target,
    Zap,
    LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, doc, setDoc, addDoc, serverTimestamp, deleteDoc, getDoc, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import { format } from "date-fns";
import clsx from "clsx";
import * as pdfjsLib from "pdfjs-dist";
import { generateResumePDF, generateInternationalModernPDF } from "@/lib/pdf-generator";
import { useRef } from "react";

// Set worker source for pdfjs - Using unpkg with dynamic version for compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
console.log("PDF Worker Source Set to:", pdfjsLib.GlobalWorkerOptions.workerSrc);

interface ResumeVersion {
    id: string;
    url: string;
    name: string;
    uploadedAt: any;
}

interface Experience {
    role: string;
    company: string;
    duration: string;
    highlights: string[];
}

interface Project {
    name: string;
    tech: string;
    category: string;
    details: string[];
}

interface Achievement {
    title: string;
    desc: string;
}

interface Education {
    degree: string;
    institution: string;
    duration: string;
}

export default function ResumePage() {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [history, setHistory] = useState<ResumeVersion[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showJDModal, setShowJDModal] = useState(false);
    const [cvTemplate, setCvTemplate] = useState<"standard" | "international">("standard");
    const [jobDescription, setJobDescription] = useState("");
    const [isAdapting, setIsAdapting] = useState(false);
    const [adaptedData, setAdaptedData] = useState<any>(null);

    // State matching CV sections
    const [resumeData, setResumeData] = useState({
        fullName: "Muhammad Ahmed Fayyaz",
        title: "MERN Stack Developer",
        email: "Ahmedmughal3182@gmail.com",
        phone: "+92 335 7035717",
        linkedin: "linkedin.com/in/ahmedz182",
        github: "github.com/ahmedz182",
        portfolio: "ahmedfayyaz.vercel.app",
        summary: "MERN Stack Developer specializing in scalable SaaS and cross-platform applications using React, Next.js, and React Native. Strong expertise in SSR, authentication systems, API integrations, and real-time applications.",
        skills: {
            languagesDB: "JavaScript, TypeScript, MongoDB, PostgreSQL, Supabase, Firebase",
            frameworksTools: "React.js, Next.js, Next API, React Native, Tailwind CSS, Bootstrap, Chart.js, Git, AWS, Clerk"
        },
        experience: [
            {
                role: "MERN Stack Developer",
                company: "Artilence Lahore",
                duration: "Feb 2025 - Present",
                highlights: [
                    "Developed scalable SaaS applications using Next.js (improved load time by 30% via SSR & code-splitting).",
                    "Built reusable modular components reducing feature development time by 25%.",
                    "Developed cross-platform mobile apps with React Native (Android & iOS).",
                    "Integrated third-party APIs (including Django services) improving workflow efficiency by 20%."
                ]
            }
        ],
        projects: [
            {
                name: "All English SeTranslator",
                tech: "React Native & Next.js",
                category: "Mobile & Web App",
                details: ["Built structured English learning platform with progress tracking & subscription system."]
            }
        ],
        achievements: [
            { title: "MERN Stack Course", desc: "Professional Freelancing Training Program (PFTP) - 3 Months" }
        ],
        education: [
            { degree: "Bachelor of Science in Computer Science", institution: "Your University Name", duration: "2020 - 2024" }
        ],
        activePdfUrl: ""
    });

    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const q = query(collection(db, "resumes"), orderBy("uploadedAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResumeVersion)));
        });

        const fetchMeta = async () => {
            try {
                const metaDoc = await getDoc(doc(db, "metadata", "resume"));
                if (metaDoc.exists()) {
                    const data = metaDoc.data();
                    // Ensure migration if data was string
                    if (typeof data.education === "string") {
                        data.education = [{ degree: data.education, institution: "", duration: "" }];
                    }
                    setResumeData(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Error fetching resume meta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeta();
        return () => unsub();
    }, []);

    const extractDataFromPDF = async (url: string) => {
        setExtracting(true);
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += pageText + " ";
            }

            // Call AI Extraction API
            const response = await fetch('/api/extract-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullText })
            });
            const result = await response.json();

            if (result.success) {
                setResumeData(prev => ({
                    ...prev,
                    ...result.extractedData
                }));
                sileo.success({ description: "Comprehensive AI scan complete! All profile fields updated." });
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error("Extraction error:", error);
            sileo.error({ description: error.message || "PDF extraction failed." });
        } finally {
            setExtracting(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            sileo.error({ description: "Please upload a valid PDF." });
            return;
        }

        setUploading(true);
        try {
            const localUrl = URL.createObjectURL(file);
            sileo.success({ description: "CV Asset Loaded Locally!" });

            if (confirm("Would you like to auto-sync your profile data from this PDF?")) {
                await extractDataFromPDF(localUrl);
            }
            setShowUploadModal(false);
            setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
        } catch (error) {
            sileo.error({ description: "Resource extraction failed." });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveBuilder = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "metadata", "resume"), { ...resumeData, updatedAt: serverTimestamp() });
            sileo.success({ description: "Resume Workspace Saved!" });
        } catch (error) {
            console.error("Save error:", error);
            sileo.error({ description: "Save operation failed." });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteHistory = async (id: string) => {
        if (!confirm("Delete this track record permanently?")) return;
        try {
            await deleteDoc(doc(db, "resumes", id));
            sileo.success({ description: "Version record removed from history." });
        } catch (error) {
            console.error("Delete error:", error);
            sileo.error({ description: "Failed to remove record." });
        }
    };

    // PDF Generation logic is now imported from @/lib/pdf-generator

    const handleDownloadCV = async () => {
        setSaving(true);
        try {
            const dataToUse = adaptedData || resumeData;
            const generator = cvTemplate === "international" ? generateInternationalModernPDF : generateResumePDF;
            const doc = await generator(dataToUse as any);
            if (doc) {
                doc.save(`${resumeData.fullName.replace(/\s+/g, '_')}_${isAdapting ? 'Adaptive_' : ''}${cvTemplate === "international" ? 'International_' : ''}Resume.pdf`);
                sileo.success({ description: `${isAdapting ? 'JD-Adapted ' : ''}${cvTemplate === "international" ? 'International Modern' : 'ATS-Friendly'} Resume Ready!` });
            }
        } catch (error) {
            console.error("PDF engine error:", error);
            sileo.error({ description: "PDF generation failed." });
        } finally {
            setSaving(false);
        }
    };

    const handleAdaptToJD = async () => {
        if (!jobDescription.trim()) {
            sileo.error({ description: "Please paste a Job Description first." });
            return;
        }
        setIsAdapting(true);
        try {
            const response = await fetch('/api/adapt-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData, jobDescription })
            });
            const result = await response.json();
            if (result.success) {
                setAdaptedData(result.adaptedData);
                sileo.success({ description: "Resume successfully adapted to JD!" });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error("Adaptation error:", error);
            sileo.error({ description: "Failed to adapt resume. Using standard data." });
        } finally {
            setIsAdapting(false);
            setShowJDModal(false);
        }
    };

    const handleSyncWithPortfolio = async () => {
        if (!confirm("This will overwrite your current Resume work with data from your Projects and Experience sections. Continue?")) return;
        
        setSaving(true);
        try {
            // 1. Fetch Active Projects
            const projQ = query(collection(db, "projects"), where("isActive", "==", true), orderBy("createdAt", "desc"));
            const projSnap = await getDocs(projQ);
            const portfolioProjects = projSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    name: data.title || "",
                    tech: (data.techStack || []).join(", "),
                    category: data.category || "Development",
                    details: data.description ? [data.description] : []
                } as Project;
            });

            // 2. Fetch Experience Journey
            const expQ = query(collection(db, "experience"), orderBy("order", "asc"));
            const expSnap = await getDocs(expQ);
            const portfolioExp = expSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    role: data.title || "",
                    company: data.company || "",
                    duration: data.date || "",
                    highlights: data.description ? data.description.split('\n').filter((l: string) => l.trim()) : []
                } as Experience;
            });

            setResumeData(prev => ({
                ...prev,
                projects: portfolioProjects.length > 0 ? portfolioProjects : prev.projects,
                experience: portfolioExp.length > 0 ? portfolioExp : prev.experience
            }));

            sileo.success({ description: "Resume synced with your portfolio journey!" });
        } catch (error) {
            console.error("Sync error:", error);
            sileo.error({ description: "Failed to sync portfolio data." });
        } finally {
            setSaving(false);
        }
    };

    const updateExp = (idx: number, field: keyof Experience, v: any) => {
        const fresh = [...resumeData.experience];
        (fresh[idx] as any)[field] = v;
        setResumeData({ ...resumeData, experience: fresh });
    }

    const updateProj = (idx: number, field: keyof Project, v: any) => {
        const fresh = [...resumeData.projects];
        (fresh[idx] as any)[field] = v;
        setResumeData({ ...resumeData, projects: fresh });
    }

    const updateAch = (idx: number, field: keyof Achievement, v: string) => {
        const fresh = [...resumeData.achievements];
        (fresh[idx] as any)[field] = v;
        setResumeData({ ...resumeData, achievements: fresh });
    }

    const updateEdu = (idx: number, field: keyof Education, v: string) => {
        const fresh = [...resumeData.education];
        (fresh[idx] as any)[field] = v;
        setResumeData({ ...resumeData, education: fresh });
    }

    if (loading) return <DashboardLoader />;

    return (
        <DashboardShell title="Strategic Career Assets" noScroll>
            <div className="flex flex-col h-full gap-6">
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-tighter text-white">Resume Architect</h2>
                            <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest leading-none mt-0.5">Strategic Career Assets</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 1. Manual Upload */}
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-accent-mint/70"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Upload PDF</span>
                        </button>

                        {/* 2. JD Adapt */}
                        <button
                            onClick={() => setShowJDModal(true)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                adaptedData ? "bg-accent-mint text-theme-dark shadow-lg shadow-accent-mint/20" : "bg-white/5 border border-white/10 text-accent-mint/70 hover:bg-white/10"
                            )}
                        >
                            <Zap className={clsx("w-3.5 h-3.5", adaptedData && "animate-pulse")} />
                            <span className="hidden lg:inline">{adaptedData ? "Adaptive Active" : "JD Adapt"}</span>
                        </button>

                        {/* 2.5 Sync with Portfolio */}
                        <button
                            onClick={handleSyncWithPortfolio}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-accent-mint"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Sync Journey</span>
                        </button>

                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setCvTemplate("standard")}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                    cvTemplate === "standard" ? "bg-accent-mint text-theme-dark" : "text-white/40 hover:text-white"
                                )}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => setCvTemplate("international")}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                                    cvTemplate === "international" ? "bg-accent-mint text-theme-dark" : "text-white/40 hover:text-white"
                                )}
                            >
                                International
                            </button>
                        </div>

                        {/* 3. Export PDF (Local Download) */}
                        <button
                            onClick={handleDownloadCV}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/50"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Local Export</span>
                        </button>

                        {/* 4. Save Metadata */}
                        <button
                            onClick={handleSaveBuilder}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-accent-mint text-theme-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent-mint/10 disabled:opacity-50 ml-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="hidden md:inline">Sync Data</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-full overflow-y-auto custom-scrollbar pr-4 pb-32 space-y-12"
                    >
                        {adaptedData && (
                            <div className="bg-accent-mint/10 border border-accent-mint/20 p-4 rounded-2xl mb-8 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Currently editing JD-optimized temporary version</span>
                                <button onClick={() => setAdaptedData(null)} className="text-[10px] font-black uppercase text-white/40 hover:text-white underline">Discard Changes</button>
                            </div>
                        )}

                        {/* Summary Section - Optimized for Adaptation */}
                        <section className="space-y-6">
                            <SectionHeader icon={FileText} title="Professional Summary" />
                            <textarea
                                className={clsx(
                                    "w-full bg-black/40 border rounded-3xl p-8 text-sm outline-none focus:border-accent-mint/30 h-40 transition-all leading-relaxed",
                                    adaptedData ? "border-accent-mint/40 text-accent-mint/90 shadow-[0_0_20px_rgba(51,214,159,0.05)]" : "border-white/5 text-text-secondary"
                                )}
                                value={adaptedData ? adaptedData.summary : resumeData.summary}
                                onChange={(e) => {
                                    if (adaptedData) setAdaptedData({ ...adaptedData, summary: e.target.value });
                                    else setResumeData({ ...resumeData, summary: e.target.value });
                                }}
                            />
                        </section>

                        {/* Skills Section */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <SectionHeader icon={Code2} title="Languages & DB" />
                                <BuilderInput label="Comma separated list" value={resumeData.skills.languagesDB} onChange={(v: string) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, languagesDB: v } })} />
                            </div>
                            <div className="space-y-6">
                                <SectionHeader icon={Wrench} title="Frameworks & Tools" />
                                <BuilderInput label="Comma separated list" value={resumeData.skills.frameworksTools} onChange={(v: string) => setResumeData({ ...resumeData, skills: { ...resumeData.skills, frameworksTools: v } })} />
                            </div>
                        </section>

                        {/* Professional Experience */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <SectionHeader icon={Briefcase} title="Career Record" />
                                <button
                                    onClick={() => {
                                        const hasEmpty = resumeData.experience.some(exp => !exp.role.trim() || !exp.company.trim());
                                        if (hasEmpty) {
                                            sileo.error({ description: "Please fill the current experience fields first." });
                                            return;
                                        }
                                        setResumeData({ ...resumeData, experience: [{ role: "", company: "", duration: "", highlights: [""] }, ...resumeData.experience] })
                                    }}
                                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-accent-mint hover:bg-accent-mint/10 transition-all"
                                >
                                    Add Experience
                                </button>
                            </div>
                            <div className="space-y-4">
                                {adaptedData ? adaptedData.experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="bg-white/[0.02] border border-accent-mint/20 rounded-3xl p-8 relative group">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <BuilderInput label="Designation" value={exp.role} onChange={(v: string) => { const f = [...adaptedData.experience]; f[idx].role = v; setAdaptedData({ ...adaptedData, experience: f }) }} />
                                            <BuilderInput label="Organization" value={exp.company} onChange={(v: string) => { const f = [...adaptedData.experience]; f[idx].company = v; setAdaptedData({ ...adaptedData, experience: f }) }} />
                                            <BuilderInput label="Timeframe" value={exp.duration} onChange={(v: string) => { const f = [...adaptedData.experience]; f[idx].duration = v; setAdaptedData({ ...adaptedData, experience: f }) }} />
                                        </div>
                                        <label className="text-[9px] font-black uppercase text-accent-mint/40 ml-2 mb-2 block">Impact Highlights (Adapted)</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-accent-mint/10 rounded-2xl p-5 text-sm outline-none focus:border-accent-mint/30 h-32 transition-all text-accent-mint/80"
                                            value={exp.highlights.join('\n')}
                                            onChange={(e) => { const f = [...adaptedData.experience]; f[idx].highlights = e.target.value.split('\n'); setAdaptedData({ ...adaptedData, experience: f }) }}
                                        />
                                    </div>
                                )) : resumeData.experience.map((exp, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative group">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <BuilderInput label="Designation" value={exp.role} onChange={(v: string) => updateExp(idx, 'role', v)} />
                                            <BuilderInput label="Organization" value={exp.company} onChange={(v: string) => updateExp(idx, 'company', v)} />
                                            <BuilderInput label="Timeframe" value={exp.duration} onChange={(v: string) => updateExp(idx, 'duration', v)} />
                                        </div>
                                        <label className="text-[9px] font-black uppercase text-white/20 ml-2 mb-2 block">Impact Highlights (Newline per point)</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-accent-mint/30 h-32 transition-all"
                                            value={exp.highlights.join('\n')}
                                            onChange={(e) => updateExp(idx, 'highlights', e.target.value.split('\n'))}
                                        />
                                        <button onClick={() => setResumeData({ ...resumeData, experience: resumeData.experience.filter((_, i) => i !== idx) })} className="absolute top-8 right-8 text-red-500/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Strategic Projects - Full Width */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <SectionHeader icon={Trophy} title="Strategic Projects" />
                                <button
                                    onClick={() => {
                                        const hasEmpty = resumeData.projects.some(proj => !proj.name.trim());
                                        if (hasEmpty) {
                                            sileo.error({ description: "Please fill the current project name first." });
                                            return;
                                        }
                                        setResumeData({ ...resumeData, projects: [{ name: "", tech: "", category: "", details: [""] }, ...resumeData.projects] })
                                    }}
                                    className="text-accent-mint text-[9px] font-black uppercase"
                                >
                                    Add Project
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {adaptedData ? adaptedData.projects.map((proj: any, idx: number) => (
                                    <div key={idx} className="bg-white/[0.02] border border-accent-mint/20 rounded-3xl p-8 relative group">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <BuilderInput label="Project Title" value={proj.name} onChange={(v: string) => { const f = [...adaptedData.projects]; f[idx].name = v; setAdaptedData({ ...adaptedData, projects: f }) }} />
                                            <BuilderInput label="Stack Used" value={proj.tech} onChange={(v: string) => { const f = [...adaptedData.projects]; f[idx].tech = v; setAdaptedData({ ...adaptedData, projects: f }) }} />
                                            <BuilderInput label="Strategic Category" value={proj.category} onChange={(v: string) => { const f = [...adaptedData.projects]; f[idx].category = v; setAdaptedData({ ...adaptedData, projects: f }) }} />
                                        </div>
                                        <label className="text-[9px] font-black uppercase text-accent-mint/40 ml-2 mb-2 block">Strategic Impact (Adapted)</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-accent-mint/10 rounded-2xl p-5 text-sm outline-none focus:border-accent-mint/30 h-32 transition-all text-accent-mint/80"
                                            value={proj.details.join('\n')}
                                            onChange={(e) => { const f = [...adaptedData.projects]; f[idx].details = e.target.value.split('\n'); setAdaptedData({ ...adaptedData, projects: f }) }}
                                        />
                                    </div>
                                )) : resumeData.projects.map((proj, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative group">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            <BuilderInput label="Project Title" value={proj.name} onChange={(v: string) => updateProj(idx, 'name', v)} />
                                            <BuilderInput label="Stack Used" value={proj.tech} onChange={(v: string) => updateProj(idx, 'tech', v)} />
                                            <BuilderInput label="Strategic Category" value={proj.category} onChange={(v: string) => updateProj(idx, 'category', v)} />
                                        </div>
                                        <label className="text-[9px] font-black uppercase text-white/20 ml-2 mb-2 block">Strategic Impact & Technical Depth</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-accent-mint/30 h-32 transition-all"
                                            value={proj.details.join('\n')}
                                            onChange={(e) => updateProj(idx, 'details', e.target.value.split('\n'))}
                                        />
                                        <button onClick={() => setResumeData({ ...resumeData, projects: resumeData.projects.filter((_, i) => i !== idx) })} className="absolute top-8 right-8 text-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Academic Degrees - Full Width */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <SectionHeader icon={GraduationCap} title="Academic Degrees" />
                                <button
                                    onClick={() => {
                                        const hasEmpty = resumeData.education.some(edu => !edu.degree.trim());
                                        if (hasEmpty) {
                                            sileo.error({ description: "Please fill the current degree first." });
                                            return;
                                        }
                                        setResumeData({ ...resumeData, education: [{ degree: "", institution: "", duration: "" }, ...resumeData.education] })
                                    }}
                                    className="text-accent-mint text-[9px] font-black uppercase"
                                >
                                    Add Degree
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative group">
                                        <div className="space-y-4">
                                            <BuilderInput label="Degree Title" value={edu.degree} onChange={(v: string) => updateEdu(idx, 'degree', v)} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <BuilderInput label="Institution" value={edu.institution} onChange={(v: string) => updateEdu(idx, 'institution', v)} />
                                                <BuilderInput label="Timeframe" value={edu.duration} onChange={(v: string) => updateEdu(idx, 'duration', v)} />
                                            </div>
                                        </div>
                                        <button onClick={() => setResumeData({ ...resumeData, education: resumeData.education.filter((_, i) => i !== idx) })} className="absolute top-4 right-4 text-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Certificates & Achievements Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <SectionHeader icon={Trophy} title="Certificates & Achievements" />
                                <button
                                    onClick={() => {
                                        const hasEmpty = resumeData.achievements.some(ach => !ach.title.trim());
                                        if (hasEmpty) {
                                            sileo.error({ description: "Please fill the current certificate title first." });
                                            return;
                                        }
                                        setResumeData({ ...resumeData, achievements: [{ title: "", desc: "" }, ...resumeData.achievements] })
                                    }}
                                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-accent-mint hover:bg-accent-mint/10 transition-all"
                                >
                                    Add Achievement
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resumeData.achievements.map((ach, idx) => (
                                    <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative group">
                                        <div className="space-y-4">
                                            <BuilderInput label="Certificate Title" value={ach.title} onChange={(v: string) => updateAch(idx, 'title', v)} />
                                            <BuilderInput label="Issuing Org / Details" value={ach.desc} onChange={(v: string) => updateAch(idx, 'desc', v)} />
                                        </div>
                                        <button onClick={() => setResumeData({ ...resumeData, achievements: resumeData.achievements.filter((_, i) => i !== idx) })} className="absolute top-4 right-4 text-red-500/20 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <AnimatePresence>
                            {showUploadModal && (
                                <PdfUploadModal
                                    onClose={() => setShowUploadModal(false)}
                                    onUpload={handleFileUpload}
                                    uploading={uploading}
                                    extracting={extracting}
                                    activePdfUrl={resumeData.activePdfUrl}
                                />
                            )}
                            {showJDModal && (
                                <JDAdapterModal
                                    onClose={() => setShowJDModal(false)}
                                    jobDescription={jobDescription}
                                    setJobDescription={setJobDescription}
                                    onAdapt={handleAdaptToJD}
                                    isAdapting={isAdapting}
                                    adaptedData={adaptedData}
                                    onReset={() => {
                                        setAdaptedData(null);
                                        setJobDescription("");
                                        setShowJDModal(false);
                                    }}
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </DashboardShell>
    );
}

function JDAdapterModal({ onClose, jobDescription, setJobDescription, onAdapt, isAdapting, adaptedData, onReset }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-mint/50 to-transparent" />

                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>

                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-white">Smart JD Adaptation</h3>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Optimize Assets for Specific Opportunities</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-2">Job Description (Requirements & Stack)</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the Job Description here to trigger AI-driven adaptation..."
                            className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm h-64 outline-none focus:border-accent-mint/30 transition-all text-white/80 placeholder:text-white/5 leading-relaxed"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onAdapt}
                            disabled={isAdapting || !jobDescription.trim()}
                            className="flex-1 py-5 bg-accent-mint text-theme-dark rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-mint/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isAdapting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                            {isAdapting ? "Optimizing Assets..." : "Execute Adaptation"}
                        </button>
                        
                        {adaptedData && (
                            <button
                                onClick={onReset}
                                className="px-8 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-[11px] font-black uppercase hover:bg-white/10 transition-all"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-bold">
                        Adaptive Mode creates a temporary layer over your CV for this session.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Reusable Components
function ActionButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
    return (
        <button onClick={onClick} className={clsx(
            "flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            active ? "bg-accent-mint text-theme-dark shadow-xl" : "text-text-muted hover:text-white"
        )}>
            <Icon className="w-4 h-4" /> {label}
        </button>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-accent-mint/10 text-accent-mint flex items-center justify-center shadow-lg shadow-accent-mint/5 border border-accent-mint/10">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">{title}</h3>
        </div>
    );
}

function BuilderInput({ label, value, onChange, Icon, placeholder }: { label: string; value: string; onChange: (v: string) => void; Icon?: any; placeholder?: string }) {
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

function DashboardLoader() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-theme-dark gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-accent-mint/20 border-t-accent-mint animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Booting Career Workspace</span>
        </div>
    );
}

function HistoryPane({ history, onDelete }: { history: ResumeVersion[]; onDelete: (id: string) => void }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-4 pb-20">
            {history.map((item: ResumeVersion) => (
                <div key={item.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:border-accent-mint/20 transition-all group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-accent-mint group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h6 className="text-[11px] font-bold text-white truncate max-w-[140px] uppercase tracking-tighter">{item.name}</h6>
                            <p className="text-[9px] text-text-muted mt-0.5">{item.uploadedAt?.toDate ? format(item.uploadedAt.toDate(), "MMM dd, yyyy") : "Processing..."}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={item.url} target="_blank" className="flex-1 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase py-3 rounded-xl text-center transition-all">Preview</a>
                        <button onClick={() => onDelete(item.id)} className="px-4 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
function PdfUploadModal({ onClose, onUpload, uploading, extracting, activePdfUrl }: any) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-mint/50 to-transparent" />

                <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={clsx(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all",
                        activePdfUrl ? "bg-accent-mint text-theme-dark shadow-2xl shadow-accent-mint/20" : "bg-white/5 text-text-muted"
                    )}>
                        <FileText className="w-10 h-10" />
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">CV Asset Control</h3>
                    <p className="text-sm text-text-muted mb-10 max-w-[280px]">Synchronize your cloud portfolio with your latest professional documentation.</p>

                    <div className={clsx(
                        "w-full rounded-[2.5rem] border-2 border-dashed p-10 transition-all",
                        activePdfUrl ? "border-accent-mint/30 bg-accent-mint/[0.03]" : "border-white/10 bg-white/[0.01]"
                    )}>
                        <h5 className="text-[10px] font-black uppercase tracking-widest mb-8">
                            {activePdfUrl ? "Active Asset: Verified" : "System Awaiting Input"}
                        </h5>

                        <label className={clsx(
                            "px-10 py-4 bg-accent-mint text-theme-dark rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-mint/10 inline-flex items-center gap-3",
                            (uploading || extracting) && "opacity-50 pointer-events-none"
                        )}>
                            <input type="file" className="hidden" accept=".pdf" onChange={onUpload} />
                            {uploading || extracting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    <span>Sync CV Asset</span>
                                </>
                            )}
                        </label>
                    </div>

                    {activePdfUrl && (
                        <div className="mt-8 flex items-center gap-2 text-accent-mint animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Live Connection Established</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
