"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
    ClipboardList,
    Receipt,
    Scale,
    IdCard,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";
import Container from "@/components/layout/Container/Container";

import StandarPelayananContent from "./content/StandarPelayananContent";
import TarifContent from "./content/TarifContent";
import HakKewajibanContent from "./content/HakKewajibanContent";
import BpjsContent from "./content/BpjsContent";
import MutuContent from "./content/MutuContent";

type CategoryId = "standar" | "tarif" | "hak" | "bpjs" | "mutu";

const categories: {
    id: CategoryId;
    label: string;
    short: string;
    icon: LucideIcon;
}[] = [
    { id: "standar", label: "Standar Pelayanan", short: "Standar", icon: ClipboardList },
    { id: "tarif", label: "Tarif Pelayanan", short: "Tarif", icon: Receipt },
    { id: "hak", label: "Hak & Kewajiban", short: "Hak & Kewajiban", icon: Scale },
    { id: "bpjs", label: "BPJS & Non-BPJS", short: "BPJS", icon: IdCard },
    { id: "mutu", label: "Mutu & Keselamatan", short: "Mutu", icon: ShieldCheck },
];

const content: Record<CategoryId, React.ReactNode> = {
    standar: <StandarPelayananContent />,
    tarif: <TarifContent />,
    hak: <HakKewajibanContent />,
    bpjs: <BpjsContent />,
    mutu: <MutuContent />,
};

const InformasiLayananLayout = () => {
    const [active, setActive] = useState<CategoryId>("standar");

    return (
        <Container sectionClassName="pt-5 md:pt-6 pb-12 md:pb-16">
            <LayoutGroup>
                {/* Category selector — a wrapping grid that always fills the card width,
                    so no horizontal scrolling is needed on any device. */}
                <div className="relative z-10 mb-10 md:mb-14">
                    <div className="rounded-3xl bg-primary p-1.5 sm:p-2 lg:p-3 shadow-[0_30px_60px_-30px_rgba(35,49,21,0.7)] ring-1 ring-white/10">
                        <div
                            role="tablist"
                            aria-label="Kategori informasi layanan"
                            className="grid grid-cols-2 gap-1 sm:gap-1.5 md:grid-cols-5"
                        >
                            {categories.map((cat, index) => {
                                const isActive = active === cat.id;
                                const Icon = cat.icon;
                                const isLast = index === categories.length - 1;
                                return (
                                    <button
                                        key={cat.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActive(cat.id)}
                                        className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5 text-[13px] sm:text-sm font-bold transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                                            isLast ? "col-span-2 md:col-span-1" : ""
                                        } ${isActive ? "text-primary" : "text-white/60 hover:text-white"}`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="activeCategoryPill"
                                                className="absolute inset-0 rounded-2xl bg-base shadow-lg"
                                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                                            <Icon
                                                className={`h-4 w-4 shrink-0 transition-colors ${
                                                    isActive ? "text-secondary" : "text-white/50"
                                                }`}
                                                strokeWidth={2}
                                            />
                                            <span className="lg:hidden">{cat.short}</span>
                                            <span className="hidden lg:inline">{cat.label}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab panel */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            role="tabpanel"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {content[active]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </LayoutGroup>
        </Container>
    );
};

export default InformasiLayananLayout;
