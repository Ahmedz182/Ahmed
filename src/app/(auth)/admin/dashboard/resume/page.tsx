"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
    Briefcase, Code2, Download, Eye, FileText, GraduationCap,
    LayoutGrid, Loader2, Mail, Save, Trash2, Trophy, Upload, Wrench, Zap,
    type LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection, doc, getDocs, getDoc, onSnapshot, orderBy,
    query, serverTimestamp, setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sileo } from "sileo";
import clsx from "clsx";
import * as pdfjsLib from "pdfjs-dist";
import {
    Achievement, Education, Experience, Project,
    ResumeData, generateResumePDF, generateInternationalModernPDF
} from "@/lib/pdf-generator";

import { StandardTemplate, InternationalTemplate } from "@/components/dashboard/resume/ResumeTemplates";
import { SectionHeader, BuilderInput, DashboardLoader } from "@/components/dashboard/resume/ResumeBuilderComponents";
import { PdfUploadModal, JDAdapterModal } from "@/components/dashboard/resume/Modals";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResumeVersion {
    id: string;
    url: string;
    name: string;
    uploadedAt: any;
}

type ActiveAsset = "resume" | "cover";
type CvTemplate = "standard" | "international";

// ─── Default State ────────────────────────────────────────────────────────────

const DEFAULT_RESUME: ResumeData & { coverLetter: string; activePdfUrl: string } = {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    skills: { languagesDB: "", frameworksTools: "" },
    experience: [],
    projects: [],
    achievements: [],
    education: [],
    coverLetter: "",
    activePdfUrl: "",
};

const BLANK_EXPERIENCE: Experience = { role: "", company: "", duration: "", highlights: [""] };
const BLANK_PROJECT: Project = { name: "", tech: "", category: "", details: [""] };
const BLANK_ACHIEVEMENT: Achievement = { title: "", desc: "" };
const BLANK_EDUCATION: Education = { degree: "", institution: "", duration: "" };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function updateArrayItem<T>(arr: T[], idx: number, field: keyof T, value: T[keyof T]): T[] {
    return arr.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
}

function removeArrayItem<T>(arr: T[], idx: number): T[] {
    return arr.filter((_, i) => i !== idx);
}

function prependItem<T>(arr: T[], blank: T): T[] {
    return [blank, ...arr];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResumePage() {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showJDModal, setShowJDModal] = useState(false);
    const [cvTemplate, setCvTemplate] = useState<CvTemplate>("standard");
    const [jobDescription, setJobDescription] = useState("");
    const [isAdapting, setIsAdapting] = useState(false);
    const [adaptedData, setAdaptedData] = useState<typeof DEFAULT_RESUME | null>(null);
    const [activeAsset, setActiveAsset] = useState<ActiveAsset>("resume");
    const [resumeData, setResumeData] = useState(DEFAULT_RESUME);
    const [history, setHistory] = useState<ResumeVersion[]>([]);

    const resumeRef = useRef<HTMLDivElement>(null);

    // ─── Data Loading ─────────────────────────────────────────────────────────

    useEffect(() => {
        const q = query(collection(db, "resumes"), orderBy("uploadedAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            setHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResumeVersion)));
        });

        const fetchMeta = async () => {
            try {
                const metaDoc = await getDoc(doc(db, "metadata", "resume"));
                if (metaDoc.exists()) {
                    const data = metaDoc.data() as any;
                    if (typeof data.education === "string") {
                        data.education = [{ degree: data.education, institution: "", duration: "" }];
                    }
                    setResumeData(prev => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Error fetching resume meta:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeta();
        return () => unsub();
    }, []);

    // ─── PDF Extraction ───────────────────────────────────────────────────────

    const extractDataFromPDF = async (url: string) => {
        setExtracting(true);
        try {
            const pdf = await pdfjsLib.getDocument(url).promise;
            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(" ") + " ";
            }
            const res = await fetch("/api/extract-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullText }),
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            setResumeData(prev => ({ ...prev, ...result.extractedData }));
            sileo.success({ description: "AI scan complete! All profile fields updated." });
        } catch (err: any) {
            sileo.error({ description: err.message || "PDF extraction failed." });
        } finally {
            setExtracting(false);
        }
    };

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== "application/pdf") {
            sileo.error({ description: "Please upload a valid PDF." });
            return;
        }
        setUploading(true);
        try {
            const localUrl = URL.createObjectURL(file);
            sileo.success({ description: "CV Asset Loaded Locally!" });
            if (confirm("Auto-sync profile data from this PDF?")) {
                await extractDataFromPDF(localUrl);
            }
            setShowUploadModal(false);
            setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
        } catch {
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
        } catch (err) {
            console.error("Save error:", err);
            sileo.error({ description: "Save operation failed." });
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadCV = async () => {
        setSaving(true);
        try {
            const dataToUse = adaptedData ?? resumeData;
            const generator = cvTemplate === "international" ? generateInternationalModernPDF : generateResumePDF;
            const pdfDoc = await generator(dataToUse as any);
            if (pdfDoc) {
                const suffix = [
                    isAdapting ? "Adaptive" : "",
                    cvTemplate === "international" ? "International" : "",
                    "Resume",
                ].filter(Boolean).join("_");
                pdfDoc.save(`${resumeData.fullName.replace(/\s+/g, "_")}_${suffix}.pdf`);
                sileo.success({ description: "Resume PDF ready!" });
            }
        } catch (err) {
            console.error("PDF engine error:", err);
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
            const res = await fetch("/api/adapt-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData, jobDescription }),
            });
            const { adaptedData: serverAdaptedData } = await res.json();
            setAdaptedData(serverAdaptedData);
            setResumeData(serverAdaptedData);
            setActiveAsset("cover");
            sileo.success({ description: "Strategy Optimized! Resume & Cover Letter ready." });
        } catch (err) {
            console.error("Adapt error:", err);
            sileo.error({ description: "AI adaptation failed." });
        } finally {
            setIsAdapting(false);
            setShowJDModal(false);
        }
    };

    const handleSyncWithPortfolio = async () => {
        if (!confirm("This will overwrite Resume data with portfolio Projects & Experience. Continue?")) return;
        setSaving(true);
        try {
            const [projSnap, expSnap] = await Promise.all([
                getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc"))),
                getDocs(query(collection(db, "experience"), orderBy("order", "asc"))),
            ]);

            const portfolioProjects: Project[] = projSnap.docs
                .map(d => ({ id: d.id, ...d.data() } as any))
                .filter(d => d.isActive !== false)
                .map(d => ({
                    name: d.title || "",
                    tech: Array.isArray(d.techStack) ? d.techStack.join(", ") : (d.tech || ""),
                    category: d.category || "Development",
                    details: d.description ? [d.description] : [],
                }));

            const portfolioExp: Experience[] = expSnap.docs
                .map(d => ({ id: d.id, ...d.data() } as any))
                .filter(d => d.isActive !== false)
                .map(d => ({
                    role: d.title || "",
                    company: d.company || "",
                    duration: d.date || "",
                    highlights: d.description ? d.description.split("\n").filter((l: string) => l.trim()) : [],
                }));

            setResumeData(prev => ({
                ...prev,
                projects: portfolioProjects.length > 0 ? portfolioProjects : prev.projects,
                experience: portfolioExp.length > 0 ? portfolioExp : prev.experience,
            }));
            sileo.success({ description: "Portfolio data synced into Resume Architect." });
        } catch (err: any) {
            sileo.error({ description: "Sync failed: " + (err.message || "Check your connection.") });
        } finally {
            setSaving(false);
        }
    };

    // ─── Array Field Updaters ─────────────────────────────────────────────────

    const updateExp = (i: number, f: keyof Experience, v: any) =>
        setResumeData(p => ({ ...p, experience: updateArrayItem(p.experience, i, f, v) }));

    const updateProj = (i: number, f: keyof Project, v: any) =>
        setResumeData(p => ({ ...p, projects: updateArrayItem(p.projects, i, f, v) }));

    const updateAch = (i: number, f: keyof Achievement, v: string) =>
        setResumeData(p => ({ ...p, achievements: updateArrayItem(p.achievements ?? [], i, f, v) }));

    const updateEdu = (i: number, f: keyof Education, v: string) =>
        setResumeData(p => ({ ...p, education: updateArrayItem(p.education, i, f, v) }));

    // ─── Render ───────────────────────────────────────────────────────────────

    if (loading) return <DashboardLoader />;

    return (
        <DashboardShell title="Strategic Career Assets" noScroll>
            <div className="flex flex-col h-full gap-6">

                {/* ── Toolbar ── */}
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
                                adaptedData
                                    ? "bg-accent-mint text-theme-dark shadow-lg shadow-accent-mint/20"
                                    : "bg-white/5 border border-white/10 text-accent-mint/70 hover:bg-white/10"
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

                        {/* Asset toggle */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {(["resume", "cover"] as const).map(asset => (
                                <button
                                    key={asset}
                                    onClick={() => setActiveAsset(asset)}
                                    className={clsx(
                                        "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                        activeAsset === asset ? "bg-accent-mint text-theme-dark shadow-lg shadow-accent-mint/10" : "text-white/40 hover:text-white"
                                    )}
                                >
                                    {asset === "resume" ? <FileText className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                    {asset === "resume" ? "Resume" : "Cover Letter"}
                                </button>
                            ))}
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

                {/* ── Content ── */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeAsset === "resume" ? (
                            <ResumeWorkshop
                                key="resume-workshop"
                                resumeData={resumeData}
                                adaptedData={adaptedData}
                                cvTemplate={cvTemplate}
                                onSetCvTemplate={setCvTemplate}
                                resumeRef={resumeRef}
                                onSetResumeData={setResumeData}
                                onDiscardAdapted={() => setAdaptedData(null)}
                                updateExp={updateExp}
                                updateProj={updateProj}
                                updateAch={updateAch}
                                updateEdu={updateEdu}
                            />
                        ) : (
                            <CoverLetterWorkshop
                                key="cover-letter-workshop"
                                coverLetter={resumeData.coverLetter}
                                onChange={v => setResumeData(p => ({ ...p, coverLetter: v }))}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {showUploadModal && (
                <PdfUploadModal
                    uploading={uploading}
                    onUpload={handleFileUpload}
                    onClose={() => setShowUploadModal(false)}
                />
            )}

            {showJDModal && (
                <JDAdapterModal
                    jobDescription={jobDescription}
                    isAdapting={isAdapting}
                    onChange={setJobDescription}
                    onAdapt={handleAdaptToJD}
                    onClose={() => setShowJDModal(false)}
                />
            )}
        </DashboardShell>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ResumeWorkshopProps {
    resumeData: typeof DEFAULT_RESUME;
    adaptedData: typeof DEFAULT_RESUME | null;
    cvTemplate: CvTemplate;
    onSetCvTemplate: (t: CvTemplate) => void;
    resumeRef: React.RefObject<HTMLDivElement | null>;
    onSetResumeData: React.Dispatch<React.SetStateAction<typeof DEFAULT_RESUME>>;
    onDiscardAdapted: () => void;
    updateExp: (i: number, f: keyof Experience, v: any) => void;
    updateProj: (i: number, f: keyof Project, v: any) => void;
    updateAch: (i: number, f: keyof Achievement, v: string) => void;
    updateEdu: (i: number, f: keyof Education, v: string) => void;
}

function ResumeWorkshop({
    resumeData, adaptedData, cvTemplate, onSetCvTemplate, resumeRef,
    onSetResumeData, onDiscardAdapted,
    updateExp, updateProj, updateAch, updateEdu,
}: ResumeWorkshopProps) {
    const set = onSetResumeData;
    const adapted = !!adaptedData;
    const [showPreview, setShowPreview] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full relative"
        >
            {/* Left: Editor */}
            <div className="h-full overflow-y-auto custom-scrollbar pr-4 space-y-12 pb-32">
                {adapted && (
                    <div className="bg-accent-mint/10 border border-accent-mint/20 p-4 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-mint">Editing JD-optimized version</span>
                        <button onClick={onDiscardAdapted} className="text-[10px] font-black uppercase text-white/40 hover:text-white underline">Discard</button>
                    </div>
                )}

                {/* Summary */}
                <section className="space-y-6">
                    <SectionHeader icon={FileText} title="Professional Summary" />
                    <textarea
                        className={clsx(
                            "w-full bg-black/40 border rounded-3xl p-8 text-sm outline-none focus:border-accent-mint/30 h-40 transition-all leading-relaxed",
                            adapted ? "border-accent-mint/40 text-accent-mint/90 shadow-[0_0_20px_rgba(51,214,159,0.05)]" : "border-white/5 text-text-secondary"
                        )}
                        value={resumeData.summary}
                        onChange={e => set(p => ({ ...p, summary: e.target.value }))}
                    />
                </section>

                {/* Skills */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <SectionHeader icon={Code2} title="Languages & DB" />
                        <BuilderInput label="Comma separated list" value={resumeData.skills.languagesDB}
                            onChange={(v: string) => set(p => ({ ...p, skills: { ...p.skills, languagesDB: v } }))} />
                    </div>
                    <div className="space-y-6">
                        <SectionHeader icon={Wrench} title="Frameworks & Tools" />
                        <BuilderInput label="Comma separated list" value={resumeData.skills.frameworksTools}
                            onChange={(v: string) => set(p => ({ ...p, skills: { ...p.skills, frameworksTools: v } }))} />
                    </div>
                </section>

                {/* Experience */}
                <ArraySection
                    icon={Briefcase} title="Career Record" addLabel="Add Experience"
                    onAdd={() => set(p => ({ ...p, experience: prependItem(p.experience, BLANK_EXPERIENCE) }))}
                >
                    {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative group">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <BuilderInput label="Designation" value={exp.role} onChange={(v: string) => updateExp(idx, "role", v)} />
                                <BuilderInput label="Organization" value={exp.company} onChange={(v: string) => updateExp(idx, "company", v)} />
                                <BuilderInput label="Timeframe" value={exp.duration} onChange={(v: string) => updateExp(idx, "duration", v)} />
                            </div>
                            <HighlightsTextarea
                                label="Impact Highlights (one per line)"
                                value={exp.highlights}
                                onChange={v => updateExp(idx, "highlights", v)}
                            />
                            <DeleteButton onClick={() => set(p => ({ ...p, experience: removeArrayItem(p.experience, idx) }))} />
                        </div>
                    ))}
                </ArraySection>

                {/* Projects */}
                <ArraySection
                    icon={Trophy} title="Strategic Projects" addLabel="Add Project"
                    onAdd={() => set(p => ({ ...p, projects: prependItem(p.projects, BLANK_PROJECT) }))}
                >
                    {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative group">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <BuilderInput label="Project Title" value={proj.name} onChange={(v: string) => updateProj(idx, "name", v)} />
                                <BuilderInput label="Stack Used" value={proj.tech} onChange={(v: string) => updateProj(idx, "tech", v)} />
                                <BuilderInput label="Category" value={proj.category} onChange={(v: string) => updateProj(idx, "category", v)} />
                            </div>
                            <HighlightsTextarea
                                label="Strategic Impact & Technical Depth"
                                value={proj.details}
                                onChange={v => updateProj(idx, "details", v)}
                            />
                            <DeleteButton onClick={() => set(p => ({ ...p, projects: removeArrayItem(p.projects, idx) }))} />
                        </div>
                    ))}
                </ArraySection>

                {/* Education */}
                <ArraySection
                    icon={GraduationCap} title="Academic Degrees" addLabel="Add Degree"
                    onAdd={() => set(p => ({ ...p, education: prependItem(p.education, BLANK_EDUCATION) }))}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative group">
                                <div className="space-y-4">
                                    <BuilderInput label="Degree Title" value={edu.degree} onChange={(v: string) => updateEdu(idx, "degree", v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <BuilderInput label="Institution" value={edu.institution} onChange={(v: string) => updateEdu(idx, "institution", v)} />
                                        <BuilderInput label="Timeframe" value={edu.duration} onChange={(v: string) => updateEdu(idx, "duration", v)} />
                                    </div>
                                </div>
                                <DeleteButton small onClick={() => set(p => ({ ...p, education: removeArrayItem(p.education, idx) }))} />
                            </div>
                        ))}
                    </div>
                </ArraySection>
            </div>

            {/* Preview button — floats bottom-right of editor */}
            <button
                onClick={() => setShowPreview(true)}
                className="absolute bottom-8 right-8 z-10 flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-accent-mint/10 hover:border-accent-mint/20 transition-all text-accent-mint/60 hover:text-accent-mint"
            >
                <Eye className="w-3.5 h-3.5" />
                Preview
            </button>

            {/* Full-screen preview overlay */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col"
                    >
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-10 py-5 border-b border-white/5 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Live Preview</span>
                                </div>
                                {/* Template toggle */}
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                    {(["standard", "international"] as const).map(tpl => (
                                        <button
                                            key={tpl}
                                            onClick={() => onSetCvTemplate(tpl)}
                                            className={clsx(
                                                "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all capitalize",
                                                cvTemplate === tpl ? "bg-accent-mint text-theme-dark" : "text-white/40 hover:text-white"
                                            )}
                                        >
                                            {tpl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white/40 hover:text-white"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* Scrollable preview content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-4xl mx-auto py-12 px-6">
                                <div ref={resumeRef} className="bg-white shadow-2xl">
                                    {cvTemplate === "standard"
                                        ? <StandardTemplate data={resumeData} />
                                        : <InternationalTemplate data={resumeData} />
                                    }
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function CoverLetterWorkshop({ coverLetter, onChange }: { coverLetter: string; onChange: (v: string) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full max-w-4xl mx-auto w-full pt-12"
        >
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 h-fit relative group">
                <div className="absolute top-8 right-8">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(coverLetter || "");
                            sileo.success({ description: "Cover letter copied!" });
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
                        value={coverLetter}
                        onChange={e => onChange(e.target.value)}
                        className="w-full bg-transparent border-none text-text-secondary leading-relaxed font-medium text-lg min-h-[600px] focus:outline-none resize-none custom-scrollbar"
                        placeholder="Adapted cover letter will appear here..."
                    />
                </div>
            </div>
            <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/5">
                Strategic Professional Narrative • Tailored for Global Excellence
            </p>
        </motion.div>
    );
}

// ─── Micro-components ─────────────────────────────────────────────────────────

function ArraySection({
    icon, title, addLabel, onAdd, children,
}: {
    icon: LucideIcon;
    title: string;
    addLabel: string;
    onAdd: () => void;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <SectionHeader icon={icon} title={title} />
                <button onClick={onAdd} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-accent-mint hover:bg-accent-mint/10 transition-all">
                    {addLabel}
                </button>
            </div>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function HighlightsTextarea({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
    return (
        <>
            <label className="text-[9px] font-black uppercase text-white/20 ml-2 mb-2 block">{label}</label>
            <textarea
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm outline-none focus:border-accent-mint/30 h-32 transition-all"
                value={value.join("\n")}
                onChange={e => onChange(e.target.value.split("\n"))}
            />
        </>
    );
}

function DeleteButton({ onClick, small }: { onClick: () => void; small?: boolean }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "absolute text-red-500/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all",
                small ? "top-4 right-4" : "top-8 right-8"
            )}
        >
            <Trash2 className={small ? "w-3.5 h-3.5" : "w-4 h-4"} />
        </button>
    );
}
