"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = "up",
    distance = 40,
}: ScrollRevealProps) {
    const initial: Record<string, number | string> = { opacity: 0 };
    if (direction === "up") initial.y = distance;
    if (direction === "down") initial.y = -distance;
    if (direction === "left") initial.x = distance;
    if (direction === "right") initial.x = -distance;

    const animate: Record<string, number | string> = { opacity: 1, x: 0, y: 0 };

    return (
        <motion.div
            className={className}
            initial={initial}
            whileInView={animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </motion.div>
    );
}
