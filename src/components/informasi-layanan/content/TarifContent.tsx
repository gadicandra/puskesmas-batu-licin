"use client";

import React from "react";
import { motion } from "motion/react";
import { BadgeCheck, Info } from "lucide-react";
import { containerVariants, itemVariants, SectionIntro, Panel } from "../_shared";

const tarif: { name: string; note: string; price: string }[] = [
    { name: "Pemeriksaan Umum (Rawat Jalan)", note: "Konsultasi dokter umum", price: "Rp 15.000" },
    { name: "Pemeriksaan Gigi & Mulut", note: "Pemeriksaan poli gigi", price: "Rp 20.000" },
    { name: "Tindakan Medis Ringan", note: "Jahit luka, ganti verban", price: "Rp 25.000 – 75.000" },
    { name: "Persalinan Normal", note: "Paket bidan & ruang bersalin", price: "Rp 800.000" },
    { name: "Pemeriksaan Laboratorium", note: "Mulai per parameter", price: "Rp 12.000" },
    { name: "Surat Keterangan Sehat", note: "Termasuk pemeriksaan dasar", price: "Rp 10.000" },
    { name: "Rawat Inap", note: "Per hari, kelas standar", price: "Rp 120.000" },
];

export default function TarifContent() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <SectionIntro
                eyebrow="Transparansi Biaya"
                title="Tarif yang jelas, tanpa biaya tersembunyi"
                description="Peserta JKN-KIS ditanggung penuh untuk layanan sesuai indikasi medis. Berikut rincian tarif untuk pasien umum."
            />

            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
                {/* BPJS notice — the primary message, given its own weight */}
                <Panel className="lg:col-span-1 flex flex-col overflow-hidden !bg-secondary !ring-secondary/40 p-8">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                        <BadgeCheck className="h-6 w-6 text-white" strokeWidth={2} />
                    </span>
                    <div className="mt-auto pt-12">
                        <p className="text-5xl font-black leading-none text-white">Gratis</p>
                        <h3 className="mt-4 text-lg font-bold text-white">
                            Peserta JKN-KIS / BPJS Kesehatan
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Seluruh layanan di fasilitas tingkat pertama tidak dipungut biaya
                            selama kepesertaan aktif dan sesuai prosedur rujukan.
                        </p>
                    </div>
                </Panel>

                {/* Tariff list — rows separated by lines, not boxes */}
                <Panel className="lg:col-span-2 p-2 md:p-3">
                    <div className="flex items-center justify-between px-5 pt-4 pb-3">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                            Layanan
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-tertiary">
                            Tarif Umum
                        </span>
                    </div>
                    <ul className="divide-y divide-primary/10">
                        {tarif.map((row) => (
                            <li
                                key={row.name}
                                className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 transition-colors hover:bg-base/60"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-base font-bold text-primary">
                                        {row.name}
                                    </p>
                                    <p className="truncate text-sm text-tertiary">{row.note}</p>
                                </div>
                                <span className="shrink-0 rounded-full bg-secondary/10 px-3.5 py-1.5 font-mono text-sm font-bold text-secondary">
                                    {row.price}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Panel>

                {/* Legal note */}
                <motion.p
                    variants={itemVariants}
                    className="lg:col-span-3 flex items-start gap-2.5 px-2 text-sm text-tertiary"
                >
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2} />
                    Tarif mengacu pada Peraturan Daerah Kabupaten Tanah Bumbu tentang
                    retribusi pelayanan kesehatan dan dapat menyesuaikan ketentuan yang berlaku.
                </motion.p>
            </div>
        </motion.div>
    );
}
