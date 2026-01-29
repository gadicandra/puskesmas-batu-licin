"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSectionContext } from "@/context/SectionContext";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
    labels?: Record<string, string>;
}

export default function ScrollIndicator({ labels = {} }: ScrollIndicatorProps) {
    const { sections, activeSection, sectionProgress } = useSectionContext();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (sections.length === 0) return null;

    return (
        <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
            {sections.map((sectionId) => {
                const isActive = activeSection === sectionId;
                const progress = sectionProgress[sectionId] || 0;

                return (
                    <motion.button
                        key={sectionId}
                        onClick={() => scrollToSection(sectionId)}
                        className="group relative flex cursor-pointer items-center justify-end"
                        layout
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* Tooltip */}
                        <AnimatePresence>
                            {labels[sectionId] && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-base opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                    {labels[sectionId]}
                                    <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1 rotate-45 bg-primary" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Dot/Pill indicator */}
                        <motion.div
                            layout
                            className={cn(
                                "relative w-2 overflow-hidden rounded-full transition-colors duration-300",
                                isActive ? "bg-tertiary-200" : "bg-tertiary-700"
                            )}
                            animate={{
                                height: isActive ? 32 : 8,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {/* Progress bar inside active pill */}
                            {isActive && (
                                <motion.div
                                    className="absolute inset-x-0 bottom-0 rounded-full bg-secondary"
                                    initial={{ height: "0%" }}
                                    animate={{
                                        height: `${Math.min(100, Math.max(0, progress))}%`
                                    }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                />
                            )}
                        </motion.div>
                    </motion.button>
                );
            })}
        </div>
    );
}
