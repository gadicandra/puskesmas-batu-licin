"use client";

import React from "react";
import { motion } from "motion/react";
import {
    IdCard,
    Wallet,
    Stethoscope,
    Baby,
    Syringe,
    FlaskConical,
    Pill,
    Ambulance,
    type LucideIcon,
} from "lucide-react";
import { containerVariants, itemVariants, SectionIntro, Panel } from "../_shared";

const jalur: {
    tone: "primary" | "secondary";
    icon: LucideIcon;
    tag: string;
    title: string;
    steps: string[];
}[] = [
    {
        tone: "secondary",
        icon: IdCard,
        tag: "Ditanggung penuh",
        title: "Jalur JKN-KIS / BPJS",
        steps: [
            "Tunjukkan kartu JKN-KIS atau KTP dengan NIK terdaftar.",
            "Pastikan Puskesmas Batu Licin sebagai FKTP terpilih.",
            "Ambil nomor antrean dan lakukan verifikasi di loket.",
            "Dilayani sesuai indikasi medis, rujukan diberikan bila perlu.",
        ],
    },
    {
        tone: "primary",
        icon: Wallet,
        tag: "Bayar sesuai tarif",
        title: "Jalur Umum (Non-BPJS)",
        steps: [
            "Bawa kartu identitas (KTP / KK) untuk pendaftaran.",
            "Ambil nomor antrean pendaftaran pasien umum.",
            "Dapatkan pelayanan sesuai kebutuhan medis.",
            "Selesaikan pembayaran di kasir sesuai daftar tarif.",
        ],
    },
];

const layanan: { icon: LucideIcon; label: string }[] = [
    { icon: Stethoscope, label: "Poli Umum" },
    { icon: Baby, label: "KIA & KB" },
    { icon: Syringe, label: "Imunisasi" },
    { icon: FlaskConical, label: "Laboratorium" },
    { icon: Pill, label: "Farmasi" },
    { icon: Ambulance, label: "UGD 24 Jam" },
];

export default function BpjsContent() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <SectionIntro
                eyebrow="Alur Pelayanan"
                title="Dua jalur pendaftaran, satu standar pelayanan"
                description="Baik peserta BPJS maupun pasien umum dilayani dengan mutu yang sama. Pilih jalur yang sesuai dan siapkan persyaratannya."
            />

            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
                {jalur.map((j) => {
                    const Icon = j.icon;
                    const accent =
                        j.tone === "secondary" ? "text-secondary" : "text-primary";
                    const chipBg =
                        j.tone === "secondary" ? "bg-secondary/10" : "bg-primary/5";
                    return (
                        <Panel key={j.title} className="p-8 md:p-9">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${chipBg}`}>
                                        <Icon className={`h-7 w-7 ${accent}`} strokeWidth={1.75} />
                                    </span>
                                    <h3 className="text-xl font-black text-primary">{j.title}</h3>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${chipBg} ${accent}`}>
                                    {j.tag}
                                </span>
                            </div>

                            <ol className="mt-7 space-y-4">
                                {j.steps.map((step, i) => (
                                    <li key={step} className="flex items-start gap-4">
                                        <span
                                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${chipBg} ${accent}`}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className="pt-0.5 text-[15px] leading-relaxed text-primary/80">
                                            {step}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </Panel>
                    );
                })}

                {/* Shared services strip */}
                <Panel className="lg:col-span-2 p-7 md:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                        Tersedia untuk kedua jalur
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {layanan.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.label}
                                    className="group flex items-center gap-3 rounded-2xl bg-base/70 px-4 py-3 transition-colors hover:bg-secondary/10"
                                >
                                    <Icon className="h-5 w-5 shrink-0 text-secondary" strokeWidth={2} />
                                    <span className="text-sm font-bold text-primary">{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </Panel>
            </div>
        </motion.div>
    );
}
