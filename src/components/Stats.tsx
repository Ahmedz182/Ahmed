"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const AnimatedCounter = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 1800;
            const stepTime = Math.abs(Math.floor(duration / value));

            const timer = setInterval(() => {
                start += 1;
                setCount(start);
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                }
            }, stepTime || 1);

            return () => clearInterval(timer);
        }
    }, [value, isInView]);

    return <span ref={ref}>{count}</span>;
};

export const Stats = () => {
    const stats = [
        { label: "Production Apps", value: 10 },
        { label: "Technologies Mastered", value: 15 },
        { label: "Components Built", value: 120 },
        { label: "Years Experience", value: 2 },
    ];

    return (
        <section className="w-full py-5 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 40, scale: 0.88 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.55, delay: idx * 0.09, ease: EASE }}
                        whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
                        className="flex flex-col items-center justify-center p-8 bg-theme-dark rounded-2xl border border-white/5 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(255,255,255,0.01)] hover:border-accent-mint/25 hover:shadow-[0_0_30px_rgba(51,214,159,0.06)] transition-colors duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <h4 className="text-4xl md:text-5xl font-bold text-white mb-2 relative z-10 flex items-center">
                            <AnimatedCounter value={stat.value} />
                            <span className="text-accent-mint ml-1">+</span>
                        </h4>

                        <p className="text-sm md:text-base text-text-muted font-medium text-center relative z-10 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {stat.label}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
