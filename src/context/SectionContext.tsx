"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SectionInfo {
    id: string;
    progress: number;
}

interface SectionContextType {
    sections: string[];
    activeSection: string;
    sectionProgress: Record<string, number>;
    registerSection: (id: string) => void;
    unregisterSection: (id: string) => void;
    setActiveSection: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
}

const SectionContext = createContext<SectionContextType | null>(null);

export function SectionProvider({ children }: { children: ReactNode }) {
    const [sections, setSections] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState<string>("");
    const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

    const registerSection = useCallback((id: string) => {
        setSections((prev) => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    }, []);

    const unregisterSection = useCallback((id: string) => {
        setSections((prev) => prev.filter((s) => s !== id));
        setSectionProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[id];
            return newProgress;
        });
    }, []);

    const updateProgress = useCallback((id: string, progress: number) => {
        setSectionProgress((prev) => ({
            ...prev,
            [id]: progress,
        }));
    }, []);

    return (
        <SectionContext.Provider
            value={{
                sections,
                activeSection,
                sectionProgress,
                registerSection,
                unregisterSection,
                setActiveSection,
                updateProgress,
            }}
        >
            {children}
        </SectionContext.Provider>
    );
}

export function useSectionContext() {
    const context = useContext(SectionContext);
    if (!context) {
        throw new Error("useSectionContext must be used within a SectionProvider");
    }
    return context;
}

export { SectionContext };
