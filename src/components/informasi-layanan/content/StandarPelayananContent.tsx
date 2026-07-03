"use client";

import React from "react";
import { motion } from "motion/react";
import {
    Clock,
    Timer,
    Ambulance,
    Pill,
    Smile,
    CalendarClock,
    type LucideIcon,
} from "lucide-react";
import { containerVariants, itemVariants, SectionIntro } from "../_shared";

type Metric = {
    icon: LucideIcon;
    value: string;
    unit: string;
    title: string;
    desc: string;
};

const metrics: Metric[] = [
    {
        icon: Clock,
        value: "≤ 60",
        unit: "menit",
        title: "Waktu Tunggu Rawat Jalan",
        desc: "Terhitung sejak pasien dipanggil di loket hingga mulai diperiksa dokter atau tenaga kesehatan.",
    },
    {
        icon: Ambulance,
        value: "≤ 5",
        unit: "menit",
        title: "Waktu Tanggap Gawat Darurat",
        desc: "Respons petugas UGD terhadap pasien dengan kondisi darurat.",
    },
    {
        icon: Timer,
        value: "≤ 15",
        unit: "menit",
        title: "Waktu Tunggu Pendaftaran",
        desc: "Dari ambil nomor antrean hingga selesai registrasi di loket.",
    },
    {
        icon: Pill,
        value: "≤ 30",
        unit: "menit",
        title: "Penyerahan Obat Jadi",
        desc: "Resep non-racikan siap diserahkan di apotek Puskesmas.",
    },
    {
        icon: Smile,
        value: "≥ 85",
        unit: "%",
        title: "Indeks Kepuasan Masyarakat",
        desc: "Hasil survei kepuasan pasien yang dievaluasi tiap triwulan.",
    },
];

const jadwal: { hari: string; jam: string }[] = [
    { hari: "Senin – Kamis", jam: "08.00 – 11.00" },
    { hari: "Jumat", jam: "07.30 – 10.30" },
    { hari: "Sabtu", jam: "08.00 – 11.00" },
];

const cardBase =
    "rounded-2xl border border-primary/10 bg-white p-6 sm:p-8 text-center transition-all duration-300 hover:border-secondary/40 hover:shadow-[0_18px_40px_-24px_rgba(35,49,21,0.35)]";

export default function StandarPelayananContent() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <SectionIntro
                eyebrow="Komitmen Layanan"
                title="Standar waktu yang kami jaga di setiap loket"
                description="Setiap tahap pelayanan memiliki batas waktu yang dipantau harian. Angka di bawah adalah janji layanan kami kepada masyarakat Batu Licin."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                        <motion.div
                            key={m.title}
                            variants={itemVariants}
                            className={`group ${cardBase} hover:-translate-y-1`}
                        >
                            <Icon
                                className="mx-auto h-9 w-9 text-secondary transition-transform duration-300 group-hover:scale-110"
                                strokeWidth={1.5}
                            />
                            <div className="mt-6 flex items-baseline justify-center gap-1.5">
                                <span className="text-4xl font-black leading-none text-primary">
                                    {m.value}
                                </span>
                                <span className="text-base font-semibold text-tertiary">
                                    {m.unit}
                                </span>
                            </div>
                            <h3 className="mt-3 text-base font-bold text-primary">{m.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-tertiary">{m.desc}</p>
                        </motion.div>
                    );
                })}

                {/* Jam Operasional — same clean card, sixth tile completes the grid */}
                <motion.div variants={itemVariants} className={cardBase}>
                    <CalendarClock
                        className="mx-auto h-9 w-9 text-secondary"
                        strokeWidth={1.5}
                    />
                    <h3 className="mt-6 text-base font-bold text-primary">Jam Operasional</h3>
                    <div className="mx-auto mt-4 max-w-xs space-y-2">
                        {jadwal.map((row) => (
                            <div
                                key={row.hari}
                                className="flex items-center justify-between gap-4 text-sm"
                            >
                                <span className="text-tertiary">{row.hari}</span>
                                <span className="font-bold text-primary">{row.jam}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-tertiary">
                        UGD &amp; UGD Kebidanan melayani 24 jam, Senin&ndash;Minggu.
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
