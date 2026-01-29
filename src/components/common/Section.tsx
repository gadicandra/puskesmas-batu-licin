"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useSectionContext } from "@/context/SectionContext";

interface SectionProps {
    id: string;
    children: ReactNode;
    className?: string;
    isFirst?: boolean;
    isLast?: boolean;
}

export default function Section({
    id,
    children,
    className = "",
    isFirst = false,
    isLast = false,
}: SectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { registerSection, unregisterSection, setActiveSection, updateProgress } =
        useSectionContext();

    // Register section on mount
    useEffect(() => {
        registerSection(id);
        return () => unregisterSection(id);
    }, [id, registerSection, unregisterSection]);

    // Determine scroll offsets based on section position
    const getScrollOffset = (): [string, string] => {
        if (isFirst) {
            return ["start start", "end center"];
        } else if (isLast) {
            return ["start center", "end end"];
        } else {
            return ["start center", "end center"];
        }
    };

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: getScrollOffset() as any,
    });

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        // Update progress for this section
        updateProgress(id, progress * 100);

        // Determine if this section is active (progress between 0 and 100)
        if (progress > 0 && progress < 1) {
            setActiveSection(id);
        } else if (progress >= 1 && isLast) {
            setActiveSection(id);
        } else if (progress <= 0 && isFirst) {
            setActiveSection(id);
        }
    });

    return (
        <motion.div ref={ref} id={id} className={className}>
            {children}
        </motion.div>
    );
}
