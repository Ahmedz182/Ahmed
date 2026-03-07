"use client";

import { motion } from "framer-motion";

export const Experience = () => {
    const experiences = [
        {
            title: "MERN Stack Developer",
            company: "Artilence Lahore",
            date: "Feb 2025 - Present",
            description: "Developed scalable SaaS applications using Next.js (improved load time by 30% via SSR & code-splitting). Built reusable modular components reducing feature development time by 25%. Developed cross-platform mobile apps with React Native. Integrated third-party APIs (including Django services) improving workflow efficiency by 20%.",
        },
        {
            title: "Frontend Web Developer",
            company: "Smash Code Faisalabad",
            date: "April 2024 - June 2024",
            description: "Internship focused on building responsive and performant web applications. Implemented session persistence using React & Local Storage. Improved responsiveness using Tailwind & Bootstrap.",
        },
        {
            title: "Freelance",
            company: "Self-Employed",
            date: "2022 - Present",
            description: "Collaborated with international clients to deliver high-quality, user-friendly web applications. Contributed to multiple frontend and full-stack initiatives, optimizing performance, enhancing UI/UX, and ensuring scalable, maintainable code.",
        },
        {
            title: "MERN Stack Course",
            company: "Professional Freelancing Training Program (PFTP)",
            date: "3 Months",
            description: "Learned React.js & RESTful API development, gaining hands-on experience in building web applications. Awarded a Certificate and Medal for outstanding performance and dedication throughout the course.",
        },
    ];

    return (
        <section id="experience" className="w-full py-24 px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
            >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    My <span className="text-accent-mint">Journey</span>
                </h2>
                <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-lg">
                    The path I've taken to refine my skills and grow as an engineer.
                </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
                {/* Central Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-4 bottom-4 w-px bg-white/10 hidden md:block" />
                {/* Mobile Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 md:hidden" />

                <div className="space-y-16 md:space-y-24">
                    {experiences.map((exp, idx) => {
                        const isEven = idx % 2 === 0;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                                className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:justify-start' : 'md:justify-end'
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-accent-mint rounded-full shadow-[0_0_20px_rgba(51,214,159,0.8)] transform -translate-x-1/2 ring-4 ring-theme-dark z-10 hidden md:block" />

                                <div className={`w-full md:w-[45%] relative pl-16 md:pl-0 text-left ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                                    {/* Mobile dot */}
                                    <div className="absolute left-6 top-8 w-4 h-4 bg-accent-mint rounded-full shadow-[0_0_20px_rgba(51,214,159,0.8)] transform -translate-x-1/2 ring-4 ring-theme-dark z-10 md:hidden" />

                                    <div className={`bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.05] hover:border-accent-mint/20 transition-all duration-300 shadow-xl relative group ${isEven ? 'hover:-translate-x-2' : 'hover:translate-x-2'}`}>

                                        {/* Connector line - desktop only */}
                                        <div className={`absolute top-1/2 -translate-y-1/2 w-12 h-px bg-white/20 hidden md:block transform scale-x-0 group-hover:scale-x-100 transition-transform origin-${isEven ? 'right' : 'left'} ${isEven ? 'right-[-3rem]' : 'left-[-3rem]'}`} />

                                        <div className={`inline-block py-1 px-4 text-xs font-bold tracking-wider text-accent-mint bg-accent-mint/10 border border-accent-mint/20 rounded-full mb-6 max-w-fit flex items-center justify-center`}>
                                            {exp.date}
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 text-white">
                                            {exp.title}
                                        </h3>
                                        <h4 className="text-text-muted font-medium mb-5 text-lg flex items-center gap-2 justify-start">
                                            {exp.company}
                                        </h4>

                                        <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
