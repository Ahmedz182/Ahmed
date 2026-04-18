import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
    maxRetries: 3,
    timeout: 30000 // 30 seconds timeout
});

export async function POST(req: Request) {
    try {
        const { fullText } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ 
                success: false, 
                error: 'GROQ_API_KEY is missing. Please add it to .env' 
            }, { status: 500 });
        }

        if (!fullText) {
            return NextResponse.json({ success: false, error: 'PDF text is required' }, { status: 400 });
        }

        const prompt = `
            You are an expert AI Resume Parser. 
            Extract structured data from the following raw text extracted from a PDF resume. 
            
            EXTRACT THE FOLLOWING:
            - fullName
            - title
            - email
            - phone
            - linkedin (URL or handle)
            - github (URL or handle)
            - portfolio (URL)
            - summary (A brief professional bio)
            - skills (Grouped into "languagesDB" and "frameworksTools")
            - experience (Array of objects with role, company, duration, and highlights)
            - projects (Array of objects with name, tech, category, and details)
            - education (Array of objects with degree, institution, duration)
            - achievements (Array of objects with title, desc)

            RAW TEXT:
            ${fullText}

            RETURN ONLY A VALID JSON OBJECT matching this exact structure:
            {
                "fullName": "...",
                "title": "...",
                "email": "...",
                "phone": "...",
                "linkedin": "...",
                "github": "...",
                "portfolio": "...",
                "summary": "...",
                "skills": {
                    "languagesDB": "...",
                    "frameworksTools": "..."
                },
                "experience": [
                    { "role": "...", "company": "...", "duration": "...", "highlights": ["...", "..."] }
                ],
                "projects": [
                    { "name": "...", "tech": "...", "category": "...", "details": ["...", "..."] }
                ],
                "education": [
                    { "degree": "...", "institution": "...", "duration": "..." }
                ],
                "achievements": [
                    { "title": "...", "desc": "..." }
                ]
            }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // Lower temperature for more consistent parsing
            response_format: { type: "json_object" }
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "{}";
        const extractedData = JSON.parse(responseText);

        return NextResponse.json({ 
            success: true, 
            extractedData 
        });

    } catch (error: any) {
        console.error('Extraction error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
