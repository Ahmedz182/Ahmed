import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { doc, getDoc } from 'firebase/firestore';
import { db as clientDb } from '@/lib/firebase';

export async function POST(req: Request) {
    try {
        const { type, data } = await req.json(); // type: 'contact' | 'hire'

        // 1. Fetch SMTP Config from Firestore
        const settingsDoc = await getDoc(doc(clientDb, "metadata", "settings"));
        if (!settingsDoc.exists()) {
            return NextResponse.json({ success: false, error: 'Settings not found' }, { status: 500 });
        }

        const settings = settingsDoc.data();
        const emailConfig = settings.email;

        if (!emailConfig || !emailConfig.enabled) {
            console.log('Email notifications are disabled.');
            return NextResponse.json({ success: true, message: 'Disabled' });
        }

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            host: emailConfig.smtpHost,
            port: parseInt(emailConfig.smtpPort),
            secure: emailConfig.smtpPort === '465', // true for 465, false for other ports
            auth: {
                user: emailConfig.smtpUser,
                pass: emailConfig.smtpPass,
            },
        });

        const subject = type === 'hire' 
            ? `🚀 New Hire Inquiry: ${data.name}` 
            : `📩 New Contact Message: ${data.name}`;

        const htmlContent = type === 'hire' 
            ? `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Hire Inquiry</h2>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Budget:</strong> ${data.budget}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${data.message}</div>
                </div>
            `
            : `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Contact Message</h2>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Subject:</strong> ${data.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${data.message}</div>
                </div>
            `;

        // 3. Send Email
        await transporter.sendMail({
            from: `"${emailConfig.smtpUser}" <${emailConfig.fromEmail}>`,
            to: emailConfig.toEmail,
            subject: subject,
            html: htmlContent,
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Email notification error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
