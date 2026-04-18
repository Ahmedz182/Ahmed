import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
    maxRetries: 3,
    timeout: 30000 // 30 seconds timeout
});

export async function POST(req: Request) {
    try {
        const { resumeData, jobDescription } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ 
                success: false, 
                error: 'GROQ_API_KEY is missing in environment variables. Please add it to .env' 
            }, { status: 500 });
        }

        if (!jobDescription) {
            return NextResponse.json({ success: false, error: 'Job description is required' }, { status: 400 });
        }

        // Clean the data to send to AI to save tokens and avoid issues
        const cleanResumeData = {
            summary: resumeData.summary,
            experience: resumeData.experience,
            projects: resumeData.projects
        };

        console.log(`Adapting resume... Payload size: ${JSON.stringify(cleanResumeData).length} chars`);

        const prompt = `
            You are an expert career coach and ATS optimization specialist. 
            Your task is to adapt a candidate's resume data to perfectly align with a provided Job Description (JD).
            
            ADAPTATION RULES:
            1. DO NOT lie or invent experience. Only rephrase, emphasize, and prioritize existing skills.
            2. Optimize the "Summary" to highlight the most relevant skills mentioned in the JD.
            3. Rewrite "highlights" in Experience and "details" in Projects to use keywords from the JD.
            4. Keep the output professional and concise.
            
            CANDIDATE DATA:
            ${JSON.stringify(cleanResumeData)}
            
            JOB DESCRIPTION:
            ${jobDescription}
            
            RETURN ONLY A VALID JSON OBJECT with the following structure:
            {
                "summary": "new adapted summary",
                "experience": [
                    { "role": "...", "company": "...", "duration": "...", "highlights": ["new adapted highlight 1", "..."] }
                ],
                "projects": [
                    { "name": "...", "tech": "...", "category": "...", "details": ["new adapted detail 1", "..."] }
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
            temperature: 0.5,
            response_format: { type: "json_object" }
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "{}";
        const adaptedDataValues = JSON.parse(responseText);

        // Merge back into a complete resume object
        const adaptedData = {
            ...resumeData,
            ...adaptedDataValues,
            isAdapted: true
        };

        return NextResponse.json({ 
            success: true, 
            adaptedData 
        });

    } catch (error: any) {
        console.error('Adaptation error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
