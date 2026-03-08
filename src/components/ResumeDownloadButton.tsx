"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateResumePDF, ResumeData } from "@/lib/pdf-generator";
import clsx from "clsx";

interface ResumeDownloadButtonProps {
    className?: string;
    variant?: "outline" | "filled";
}

export const ResumeDownloadButton = ({ className, variant = "outline" }: ResumeDownloadButtonProps) => {
    const [generating, setGenerating] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);

    useEffect(() => {
        const fetchResumeData = async () => {
            try {
                const docRef = doc(db, "metadata", "resume");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setResumeData(docSnap.data() as ResumeData);
                }
            } catch (error) {
                console.error("Error fetching resume data:", error);
            }
        };

        fetchResumeData();
    }, []);

    const handleDownload = async () => {
        if (!resumeData) return;
        setGenerating(true);
        try {
            const doc = await generateResumePDF(resumeData);
            if (doc) {
                doc.save(`${resumeData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
            }
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setGenerating(false);
        }
    };

    const baseStyles = "flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium transition-all disabled:opacity-50";
    const variantStyles = variant === "outline"
        ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
        : "bg-accent-mint text-theme-dark font-bold hover:bg-soft-mint shadow-lg shadow-accent-mint/10";

    return (
        <button
            onClick={handleDownload}
            disabled={generating || !resumeData}
            className={clsx(baseStyles, variantStyles, className)}
        >
            {generating ? (
                <Loader2 className="w-4 h-4 animate-spin text-accent-mint" />
            ) : (
                <FileText className="w-4 h-4" />
            )}
            Resume
        </button>
    );
};
