"use client";

import React from "react";
import { motion } from "motion/react";
import { HeartHandshake, ShieldCheck, Check } from "lucide-react";
import { containerVariants, itemVariants, SectionIntro, Panel } from "../_shared";

const hak: string[] = [
    "Memperoleh pelayanan yang manusiawi, adil, dan tanpa diskriminasi.",
    "Mengetahui diagnosis, tindakan medis, serta risiko dan alternatifnya.",
    "Mendapat perlindungan privasi dan kerahasiaan rekam medis.",
    "Menyetujui atau menolak tindakan medis (informed consent).",
    "Menyampaikan keluhan dan memperoleh tanggapan yang layak.",
    "Didampingi keluarga dalam kondisi kritis sesuai ketentuan.",
];

const kewajiban: string[] = [
    "Memberikan informasi kesehatan yang jujur dan selengkap-lengkapnya.",
    "Mematuhi nasihat dan petunjuk tenaga kesehatan.",
    "Mematuhi peraturan serta tata tertib yang berlaku di Puskesmas.",
    "Menghormati hak pasien lain, petugas, dan pengunjung.",
    "Memenuhi kewajiban administrasi sesuai ketentuan yang berlaku.",
    "Turut menjaga kebersihan dan ketertiban lingkungan fasilitas.",
];

function List({
    items,
    tone,
}: {
    items: string[];
    tone: "primary" | "secondary";
}) {
    const chip =
        tone === "primary"
            ? "bg-primary/10 text-primary"
            : "bg-secondary/10 text-secondary";
    return (
        <ul className="mt-6 space-y-3">
            {items.map((text) => (
                <li key={text} className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg ${chip}`}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-primary/80">{text}</span>
                </li>
            ))}
        </ul>
    );
}

export default function HakKewajibanContent() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
            <SectionIntro
                eyebrow="Kemitraan Layanan"
                title="Pelayanan terbaik lahir dari hak dan tanggung jawab bersama"
                description="Kami menjunjung hak setiap pasien dan mengajak Anda memenuhi kewajiban agar pelayanan berjalan aman, adil, dan nyaman untuk semua."
            />

            <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
                <Panel className="p-8 md:p-10">
                    <div className="flex items-center gap-4">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/5">
                            <HeartHandshake className="h-7 w-7 text-primary" strokeWidth={1.75} />
                        </span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
                                Yang Anda terima
                            </p>
                            <h3 className="text-2xl font-black text-primary">Hak Pasien</h3>
                        </div>
                    </div>
                    <List items={hak} tone="primary" />
                </Panel>

                <Panel className="p-8 md:p-10 lg:mt-8">
                    <div className="flex items-center gap-4">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary/10">
                            <ShieldCheck className="h-7 w-7 text-secondary" strokeWidth={1.75} />
                        </span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
                                Yang kami harapkan
                            </p>
                            <h3 className="text-2xl font-black text-primary">Kewajiban Pasien</h3>
                        </div>
                    </div>
                    <List items={kewajiban} tone="secondary" />
                </Panel>
            </div>
        </motion.div>
    );
}
