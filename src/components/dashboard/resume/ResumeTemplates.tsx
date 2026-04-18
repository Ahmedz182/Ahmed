import React from 'react';
import { ResumeData } from '@/lib/pdf-generator';

export function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 whitespace-nowrap">{title}</h3>
            <div className="flex-1 h-[1px] bg-gray-100" />
        </div>
    );
}

export function StandardTemplate({ data }: { data: ResumeData }) {
    return (
        <div className="p-16 bg-white text-gray-900 font-serif min-h-[1100px] w-full max-w-[800px] mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-black mb-2">{data.fullName || "Your Full Name"}</h1>
                <p className="text-lg font-medium text-gray-600 mb-4">{data.title || "Your Professional Title"}</p>
                <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 font-sans">
                    <span>{data.email}</span>
                    <span>•</span>
                    <span>{data.phone}</span>
                    {data.portfolio && (
                        <>
                            <span>•</span>
                            <span>{data.portfolio.replace(/^https?:\/\//, '')}</span>
                        </>
                    )}
                    {data.linkedin && (
                        <>
                            <span>•</span>
                            <span>LinkedIn</span>
                        </>
                    )}
                </div>
            </header>

            <div className="space-y-10">
                <section>
                    <SectionTitle title="Professional Summary" />
                    <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
                </section>

                <section>
                    <SectionTitle title="Core Expertise" />
                    <div className="grid grid-cols-1 gap-4 text-sm">
                        <p><span className="font-bold">Languages & DB:</span> {data.skills.languagesDB}</p>
                        <p><span className="font-bold">Frameworks & Tools:</span> {data.skills.frameworksTools}</p>
                    </div>
                </section>

                <section>
                    <SectionTitle title="Experience journey" />
                    <div className="space-y-8">
                        {data.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h4 className="font-bold text-base text-black">{exp.role} <span className="font-normal text-gray-400">|</span> <span className="text-gray-600">{exp.company}</span></h4>
                                    <span className="text-xs font-medium text-gray-500">{exp.duration}</span>
                                </div>
                                <ul className="list-disc list-outside ml-5 space-y-1">
                                    {exp.highlights.map((h, j) => h.trim() && (
                                        <li key={j} className="text-sm text-gray-700">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <SectionTitle title="Strategic Projects" />
                    <div className="space-y-8">
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h4 className="font-bold text-base text-black">{proj.name} <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-widest">{proj.category}</span></h4>
                                    <span className="text-xs text-gray-500 font-mono italic">{proj.tech}</span>
                                </div>
                                <ul className="list-disc list-outside ml-5 space-y-1">
                                    {proj.details.map((d, j) => d.trim() && (
                                        <li key={j} className="text-sm text-gray-700">{d}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <SectionTitle title="Academic Foundation" />
                    <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <h4 className="font-bold text-sm text-black">{edu.degree}</h4>
                                    <p className="text-xs text-gray-600">{edu.institution}</p>
                                </div>
                                <span className="text-xs text-gray-500">{edu.duration}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export function InternationalTemplate({ data }: { data: ResumeData }) {
    return (
        <div className="p-16 bg-white text-gray-900 font-sans min-h-[1100px] w-full max-w-[800px] mx-auto border-t-[12px] border-black">
            <header className="mb-12">
                <h1 className="text-5xl font-black uppercase tracking-tight text-black mb-2">{data.fullName || "Your Full Name"}</h1>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
                    <span>{data.title}</span>
                    <span>/</span>
                    <span className="text-black">{data.email}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                    <div>
                        <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Contact Strategy</h6>
                        <ul className="space-y-2 text-xs font-medium">
                            <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Location</span> Global Remote</li>
                            <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Phone</span> {data.phone}</li>
                            {data.github && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-400">Github</span> {data.github.split('/').pop()}</li>}
                        </ul>
                    </div>
                    <div>
                        <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Executive Profile</h6>
                        <p className="text-xs leading-relaxed font-medium text-gray-600">{data.summary}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-4 space-y-12">
                     <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border-b-2 border-black pb-1">Technical Stack</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-bold text-gray-300 uppercase mb-2">Languages & DB</p>
                                <p className="text-xs font-bold leading-relaxed">{data.skills.languagesDB}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-300 uppercase mb-2">Systems & Tools</p>
                                <p className="text-xs font-bold leading-relaxed">{data.skills.frameworksTools}</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border-b-2 border-black pb-1">Academic</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <p className="text-[11px] font-black leading-tight uppercase">{edu.degree}</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-1">{edu.institution}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <div className="col-span-8 space-y-12">
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block border-b-2 border-black pb-1">Experience Journey</h3>
                        <div className="space-y-10">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l border-gray-100">
                                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-black" />
                                    <div className="flex justify-between items-baseline mb-3">
                                        <h4 className="font-black text-xs uppercase tracking-tight">{exp.role}</h4>
                                        <span className="text-[9px] font-bold text-gray-300">{exp.duration}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">{exp.company}</p>
                                    <ul className="space-y-3">
                                        {exp.highlights.map((h, j) => h.trim() && (
                                            <li key={j} className="text-[11px] font-medium leading-relaxed text-gray-600">{h}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
