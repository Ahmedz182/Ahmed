
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const rootDir = process.cwd();
        const mobilePath = path.join(rootDir, 'mobile PROJECT_DETAILS.md');
        const webPath = path.join(rootDir, 'web PROJECT_OVERVIEW.md');

        const mobileContent = fs.readFileSync(mobilePath, 'utf8');
        const webContent = fs.readFileSync(webPath, 'utf8');

        return NextResponse.json({
            projects: [
                {
                    title: 'All-English Mobile App',
                    description: 'A comprehensive mobile educational platform built with React Native and Expo for mastering the English language.',
                    techStack: ['React Native', 'Expo', 'Firebase', 'IAP', 'Context API'],
                    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1200',
                    fullDescription: mobileContent,
                    architecture: 'Modular React Native Architecture with Global Context providers and API services.',
                    caseStudy: 'Focused on accessibility for Sinhala-speaking learners in Sri Lanka.',
                    challenges: 'Optimizing for 16KB memory page sizes for Android 15 compatibility.',
                    role: 'Lead Mobile Developer',
                    timeline: '2024',
                    images: []
                },
                {
                    title: 'SeTranslator Web Platform',
                    description: 'Premium English learning web portal with advanced admin dashboard and localized payment integration.',
                    techStack: ['Next.js', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'PayHere'],
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
                    fullDescription: webContent,
                    architecture: 'T3-style architecture with Next.js App Router and Supabase backend.',
                    caseStudy: 'Solving localized payment and cross-platform sync issues.',
                    challenges: 'Implementing secure magic-link-style auto-authentication from mobile to web.',
                    role: 'Full Stack Developer',
                    timeline: '2023 - 2024',
                    images: []
                }
            ]
        });
    } catch (error) {
        console.error('Error reading project files:', error);
        return NextResponse.json({ error: 'Failed to read local files' }, { status: 500 });
    }
}
