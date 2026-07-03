"use client";

import React from "react";
import { motion } from "motion/react";
import {
    Fingerprint,
    MessagesSquare,
    Pill,
    ScanLine,
    Sparkles,
    PersonStanding,
    type LucideIcon,
} from "lucide-react";
import { containerVariants, itemVariants, SectionIntro, Panel } from "../_shared";

const indikator: { label: string; value: number; target: number }[] = [
    { label: "Kepatuhan Kebersihan Tangan", value: 92, target: 85 },
    { label: "Kepatuhan Identifikasi Pasien", value: 99, target: 100 },
    { label: "Ketepatan Jam Buka Pelayanan", value: 96, target: 90 },
    { label: "Indeks Kepuasan Pasien", value: 88, target: 85 },
];

const skp: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Fingerprint, title: "Identifikasi Pasien", desc: "Ketepatan identifikasi dengan minimal dua identitas." },
    { icon: MessagesSquare, title: "Komunikasi Efektif", desc: "Konfirmasi ulang instruksi lisan dan hasil kritis." },
    { icon: Pill, title: "Keamanan Obat", desc: "Pengawasan obat high-alert dan yang perlu diwaspadai." },
    { icon: ScanLine, title: "Tepat Prosedur", desc: "Tepat lokasi, tepat prosedur, dan tepat pasien tindakan." },
    { icon: Sparkles, title: "Pengurangan Infeksi", desc: "Penerapan kewaspadaan standar pencegahan infeksi." },
    { icon: PersonStanding, title: "Risiko Jatuh", desc: "Asesmen dan pencegahan risiko pasien cedera akibat jatuh." },
];

function Bar({ value, target }: { value: number; target: number }) {
    const met = value >= target;
    return (
        <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className={`h-full rounded-full ${met ? "bg-secondary" : "bg-primary/50"}`}
            />
        </div>
    );
}

export default function MutuContent() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <SectionIntro
                eyebrow="Mutu & Keselamatan"
                title="Mutu yang terukur, keselamatan yang terjaga"
                description="Kami memantau indikator mutu secara berkala dan menerapkan enam Sasaran Keselamatan Pasien di setiap unit pelayanan."
            />

            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-5">
                {/* Quality indicators with animated bars */}
                <Panel className="lg:col-span-3 p-8 md:p-10">
                    <h3 className="text-lg font-black text-primary">Capaian Indikator Mutu</h3>
                    <p className="mt-1 text-sm text-tertiary">Rata-rata capaian triwulan berjalan.</p>
                    <div className="mt-8 space-y-7">
                        {indikator.map((ind) => {
                            const met = ind.value >= ind.target;
                            return (
                                <div key={ind.label}>
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="text-sm font-bold text-primary">{ind.label}</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-mono text-lg font-black text-primary">
                                                {ind.value}%
                                            </span>
                                            <span
                                                className={`font-mono text-xs font-bold ${
                                                    met ? "text-secondary" : "text-tertiary"
                                                }`}
                                            >
                                                target {ind.target}%
                                            </span>
                                        </div>
                                    </div>
                                    <Bar value={ind.value} target={ind.target} />
                                </div>
                            );
                        })}
                    </div>
                </Panel>

                {/* Six patient-safety goals */}
                <div className="lg:col-span-2">
                    <p className="mb-4 px-1 text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                        Enam Sasaran Keselamatan Pasien
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {skp.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <Panel
                                    key={s.title}
                                    className="group flex items-start gap-4 p-5 transition-transform duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary/10">
                                        <Icon className="h-5 w-5 text-secondary" strokeWidth={2} />
                                        <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary font-mono text-[10px] font-bold text-base">
                                            {i + 1}
                                        </span>
                                    </span>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-primary">{s.title}</h4>
                                        <p className="mt-0.5 text-[13px] leading-snug text-tertiary">
                                            {s.desc}
                                        </p>
                                    </div>
                                </Panel>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
