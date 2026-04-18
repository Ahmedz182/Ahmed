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
    Briefcase, 
    GraduationCap, 
    Trophy, 
    Download, 
    Target, 
    Zap, 
    LayoutGrid,
    Mail,
    Eye,
    Code2,
    Wrench
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, orderBy, onSnapshot, doc, setDoc, getDoc, addDoc, deleteDoc, serverTimestamp, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import { format } from "date-fns";
import clsx from "clsx";
import * as pdfjsLib from "pdfjs-dist";
import { generateResumePDF, ResumeData, Experience, Project, Achievement, Education } from "@/lib/pdf-generator";
import { useRef } from "react";

// Modular Imports
import { StandardTemplate, InternationalTemplate } from "@/components/dashboard/resume/ResumeTemplates";
import { SectionHeader, BuilderInput, DashboardLoader, ActionButton } from "@/components/dashboard/resume/ResumeBuilderComponents";
import { PdfUploadModal, JDAdapterModal } from "@/components/dashboard/resume/Modals";

// Set worker source for pdfjs - Using unpkg with dynamic version for compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ResumeVersion {
    id: string;
    url: string;
    name: string;
    uploadedAt: any;
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
                name: "Votex",
                tech: "Next.js, Firebase, Framer Motion",
                category: "Web3 / Governance",
                details: ["Developed a decentralized voting platform for transparent, blockchain-inspired result tracking."]
            },
            {
                name: "Coin Theater",
                tech: "React, Supabase, Chart.js",
                category: "Fintech / Analytics",
                details: ["Built an immersive crypto analytics suite with real-time price heatmaps and portfolio monitoring."]
            },
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
        coverLetter: "",
        activePdfUrl: ""
    });

    const [activeAsset, setActiveAsset] = useState<"resume" | "cover">("resume");

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
            const res = await fetch('/api/adapt-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData, jobDescription })
            });
            const { adaptedData: serverAdaptedData } = await res.json();
            setAdaptedData(serverAdaptedData);
            setResumeData(serverAdaptedData);
            setActiveAsset("resume");
            sileo.success({ description: "Resume & Cover Letter adapted to JD!" });
        } catch (error) {
            console.error("Adapt error:", error);
            sileo.error({ description: "AI adaptation failed." });
        } finally {
            setIsAdapting(false);
            setShowJDModal(false);
        }
    };

    const handleSyncWithPortfolio = async () => {
        if (!confirm("This will overwrite your current Resume work with data from your Projects and Experience sections. Continue?")) return;
        
        setSaving(true);
        try {
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
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-accent-mint/70"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Upload PDF</span>
                        </button>

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
                                onClick={() => setActiveAsset("resume")}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    activeAsset === "resume" ? "bg-accent-mint text-theme-dark shadow-lg shadow-accent-mint/10" : "text-white/40 hover:text-white"
                                )}
                            >
                                <FileText className="w-3 h-3" />
                                Resume
                            </button>
                            <button
                                onClick={() => setActiveAsset("cover")}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    activeAsset === "cover" ? "bg-accent-mint text-theme-dark shadow-lg shadow-accent-mint/10" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Mail className="w-3 h-3" />
                                Cover Letter
                            </button>
                        </div>

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

                        <button
                            onClick={handleDownloadCV}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/50"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline">Local Export</span>
                        </button>

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
                    <AnimatePresence mode="wait">
                        {activeAsset === "resume" ? (
                            <motion.div
                                key="resume-workshop"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                {/* Left: Architect (Edit) */}
                                <div className="h-full overflow-y-auto custom-scrollbar pr-4 space-y-12 pb-32">
                                    {adaptedData && (
                                        <div className="bg-accent-mint/10 border border-accent-mint/20 p-4 rounded-2xl mb-8 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Currently editing JD-optimized temporary version</span>
                                            <button onClick={() => setAdaptedData(null)} className="text-[10px] font-black uppercase text-white/40 hover:text-white underline">Discard Changes</button>
                                        </div>
                                    )}

                                    {/* Summary Section */}
                                    <section className="space-y-6">
                                        <SectionHeader icon={FileText} title="Professional Summary" />
                                        <textarea
                                            className={clsx(
                                                "w-full bg-black/40 border rounded-3xl p-8 text-sm outline-none focus:border-accent-mint/30 h-40 transition-all leading-relaxed",
                                                adaptedData ? "border-accent-mint/40 text-accent-mint/90 shadow-[0_0_20px_rgba(51,214,159,0.05)]" : "border-white/5 text-text-secondary"
                                            )}
                                            value={resumeData.summary}
                                            onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
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
                                                onClick={() => setResumeData({ ...resumeData, experience: [{ role: "", company: "", duration: "", highlights: [""] }, ...resumeData.experience] })}
                                                className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-accent-mint hover:bg-accent-mint/10 transition-all"
                                            >
                                                Add Experience
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {resumeData.experience.map((exp, idx) => (
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

                                    {/* Strategic Projects */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <SectionHeader icon={Trophy} title="Strategic Projects" />
                                            <button
                                                onClick={() => setResumeData({ ...resumeData, projects: [{ name: "", tech: "", category: "", details: [""] }, ...resumeData.projects] })}
                                                className="text-accent-mint text-[9px] font-black uppercase"
                                            >
                                                Add Project
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            {resumeData.projects.map((proj, idx) => (
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

                                    {/* Education */}
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <SectionHeader icon={GraduationCap} title="Academic Degrees" />
                                            <button
                                                onClick={() => setResumeData({ ...resumeData, education: [{ degree: "", institution: "", duration: "" }, ...resumeData.education] })}
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
                                </div>

                                {/* Right: Preview Panel */}
                                <div className="h-full hidden lg:flex flex-col gap-6">
                                    <div className="flex items-center justify-between shrink-0">
                                        <SectionHeader icon={Eye} title="Live Preview" />
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                                            <span className="text-[8px] font-black uppercase tracking-widest text-accent-mint/40">Real-time sync active</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden relative group">
                                         <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-12">
                                            <div ref={resumeRef} className="bg-white shadow-2xl origin-top scale-[0.85] xl:scale-100">
                                                {cvTemplate === "standard" ? (
                                                    <StandardTemplate data={resumeData} />
                                                ) : (
                                                    <InternationalTemplate data={resumeData} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="cover-letter-workshop"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full max-w-4xl mx-auto w-full pt-12"
                            >
                                <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 h-fit relative group">
                                    <div className="absolute top-8 right-8 flex gap-2">
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(resumeData.coverLetter || "");
                                                sileo.success({ description: "Cover letter copied to clipboard!" });
                                            }}
                                            className="p-3 bg-accent-mint text-theme-dark rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent-mint/10"
                                        >
                                            <Zap className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Cover Letter Studio</h3>
                                            <div className="h-1 w-20 bg-accent-mint rounded-full" />
                                        </div>

                                        <textarea
                                            value={resumeData.coverLetter}
                                            onChange={(e) => setResumeData({ ...resumeData, coverLetter: e.target.value })}
                                            className="w-full bg-transparent border-none text-text-secondary leading-relaxed font-medium text-lg min-h-[600px] focus:outline-none resize-none custom-scrollbar"
                                            placeholder="Adapted cover letter will appear here..."
                                        />
                                    </div>
                                </div>
                                <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/5">
                                    Strategic Professional Narrative • Tailored for Global Excellence
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DashboardShell>
    );
}



