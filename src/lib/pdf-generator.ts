import jsPDF from "jspdf";

export interface Experience {
    role: string;
    company: string;
    duration: string;
    highlights: string[];
}

export interface Project {
    name: string;
    tech: string;
    category: string;
    details: string[];
}

export interface Education {
    degree: string;
    institution: string;
    duration: string;
}

export interface ResumeData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
    skills: {
        languagesDB: string;
        frameworksTools: string;
    };
    experience: Experience[];
    projects: Project[];
    education: Education[];
}

export const generateResumePDF = async (resumeData: ResumeData) => {
    if (!resumeData) return null;
    const doc = new jsPDF();
    const margin = 10;
    let cursorY = 15;

    const addSeparator = () => {
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, 210 - margin, cursorY);
        cursorY += 6;
    };

    const addLink = (text: string, x: number, y: number, url: string) => {
        const fullUrl = url.startsWith('http') || url.startsWith('mailto:') ? url : `https://${url}`;
        doc.setDrawColor(0, 0, 0);
        doc.setTextColor(0, 0, 0);
        doc.text(text, x, y);
        const width = doc.getTextWidth(text);
        doc.link(x, y - 4, width, 5, { url: fullUrl });
        return width;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text(resumeData.fullName.toUpperCase(), margin, cursorY);
    cursorY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(resumeData.title, margin, cursorY);
    cursorY += 8;

    // Contact Info
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const contactItems = [
        resumeData.email,
        resumeData.phone,
        resumeData.portfolio,
        resumeData.linkedin,
        resumeData.github
    ].filter(Boolean);

    let contactX = margin;
    contactItems.forEach((item, i) => {
        const isLink = item.includes('.') || item.includes('@');
        let w = 0;
        if (isLink && !item.includes('+')) {
            w = addLink(item, contactX, cursorY, item);
        } else {
            doc.text(item, contactX, cursorY);
            w = doc.getTextWidth(item);
        }
        contactX += w;
        if (i < contactItems.length - 1) {
            doc.text("  \u2022  ", contactX, cursorY);
            contactX += doc.getTextWidth("  \u2022  ");
        }
    });

    cursorY += 7;
    addSeparator();
    cursorY += 1;

    const sectionTitleSize = 11;
    const bodySize = 10;
    const subTitleSize = 10;
    const dateSize = 9;

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(sectionTitleSize);
    doc.setTextColor(0, 0, 0);
    doc.text("PROFESSIONAL SUMMARY", margin, cursorY);
    cursorY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(bodySize);
    doc.setTextColor(66, 66, 66);
    const summaryLines = doc.splitTextToSize(resumeData.summary, 210 - (margin * 2));
    doc.text(summaryLines, margin, cursorY, { lineHeightFactor: 1.3 });
    cursorY += (summaryLines.length * 5) + 6;

    // Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(sectionTitleSize);
    doc.setTextColor(0, 0, 0);
    doc.text("TECHNICAL SKILLS", margin, cursorY);
    cursorY += 6;

    doc.setFontSize(bodySize);
    const skillsItems = [
        { label: "Languages & Databases: ", value: resumeData.skills.languagesDB },
        { label: "Frameworks & Tools: ", value: resumeData.skills.frameworksTools }
    ];

    skillsItems.forEach(s => {
        doc.setFont("helvetica", "bold");
        doc.text(s.label, margin, cursorY);
        const lw = doc.getTextWidth(s.label);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(66, 66, 66);
        doc.text(s.value, margin + lw, cursorY);
        cursorY += 6;
    });
    cursorY += 4;

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(sectionTitleSize);
        doc.setTextColor(0, 0, 0);
        doc.text("WORK EXPERIENCE", margin, cursorY);
        cursorY += 7;

        resumeData.experience.forEach((exp) => {
            if (cursorY > 260) { doc.addPage(); cursorY = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(subTitleSize);
            doc.text(exp.role, margin, cursorY);
            const roleW = doc.getTextWidth(exp.role);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text(` | ${exp.company}`, margin + roleW, cursorY);
            doc.setFontSize(dateSize);
            const dW = doc.getTextWidth(exp.duration);
            doc.text(exp.duration, 210 - margin - dW, cursorY);
            cursorY += 6;
            doc.setFontSize(bodySize);
            doc.setTextColor(66, 66, 66);
            exp.highlights.forEach((h: string) => {
                if (!h.trim()) return;
                if (cursorY > 275) { doc.addPage(); cursorY = 20; }
                const bullets = doc.splitTextToSize(`\u2022 ${h}`, 210 - (margin * 2) - 4);
                doc.text(bullets, margin + 4, cursorY, { lineHeightFactor: 1.25 });
                cursorY += (bullets.length * 5) + 1;
            });
            cursorY += 4;
        });
        cursorY += 4;
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
        if (cursorY > 250) { doc.addPage(); cursorY = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(sectionTitleSize);
        doc.setTextColor(0, 0, 0);
        doc.text("KEY PROJECTS", margin, cursorY);
        cursorY += 7;
        resumeData.projects.forEach((proj) => {
            if (cursorY > 265) { doc.addPage(); cursorY = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(subTitleSize);
            doc.text(proj.name, margin, cursorY);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(dateSize);
            const tW = doc.getTextWidth(proj.tech);
            doc.text(proj.tech, 210 - margin - tW, cursorY);
            cursorY += 6;
            doc.setFontSize(bodySize);
            doc.setTextColor(66, 66, 66);
            proj.details.forEach((d: string) => {
                if (!d.trim()) return;
                if (cursorY > 275) { doc.addPage(); cursorY = 20; }
                const lines = doc.splitTextToSize(`\u2022 ${d}`, 210 - (margin * 2) - 4);
                doc.text(lines, margin + 3, cursorY, { lineHeightFactor: 1.25 });
                cursorY += (lines.length * 4.5) + 0.5;
            });
            cursorY += 4;
        });
        cursorY += 4;
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
        if (cursorY > 250) { doc.addPage(); cursorY = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(sectionTitleSize);
        doc.setTextColor(0, 0, 0);
        doc.text("EDUCATION", margin, cursorY);
        cursorY += 7;
        resumeData.education.forEach((edu) => {
            if (cursorY > 275) { doc.addPage(); cursorY = 20; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(subTitleSize);
            doc.text(edu.degree, margin, cursorY);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(dateSize);
            const edW = doc.getTextWidth(edu.duration);
            doc.text(edu.duration, 210 - margin - edW, cursorY);
            cursorY += 5;
            doc.setFontSize(bodySize);
            doc.setTextColor(66, 66, 66);
            doc.text(edu.institution, margin, cursorY);
            cursorY += 8;
        });
    }
    return doc;
};
