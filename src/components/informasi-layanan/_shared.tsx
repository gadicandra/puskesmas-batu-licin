"use client";

import React from "react";
import { motion, type Variants } from "motion/react";

export const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
};

export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 20 },
    },
};

/** Centered tab heading. Eyebrow + single-color title + optional lead paragraph. */
export function SectionIntro({
    eyebrow,
    title,
    description,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
}) {
    return (
        <motion.div
            variants={itemVariants}
            className="mx-auto mb-10 md:mb-14 max-w-2xl text-center"
        >
            {eyebrow && (
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-primary leading-tight">
                {title}
            </h2>
            {description && (
                <p className="mt-4 text-base leading-relaxed text-tertiary">
                    {description}
                </p>
            )}
        </motion.div>
    );
}

/** White surface with a green-tinted diffusion shadow, matching the palette. */
export function Panel({
    children,
    className = "",
    as: Tag = "div",
}: {
    children: React.ReactNode;
    className?: string;
    as?: "div" | "li";
}) {
    const MotionTag = Tag === "li" ? motion.li : motion.div;
    return (
        <MotionTag
            variants={itemVariants}
            className={`rounded-[1.75rem] bg-white ring-1 ring-primary/10 shadow-[0_24px_48px_-30px_rgba(35,49,21,0.5)] ${className}`}
        >
            {children}
        </MotionTag>
    );
}
