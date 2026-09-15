"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Search, Stethoscope } from "lucide-react";
import type { DokterPublik } from "@/lib/konten/dokter";
import FotoDokter from "./FotoDokter";
import JadwalMingguanDokter from "./JadwalMingguanDokter";

type DirektoriDokterProps = {
    dokter: DokterPublik[];
};

const formatterSpesialis = new Intl.Collator("id-ID", { sensitivity: "base" });

export default function DirektoriDokter({ dokter }: DirektoriDokterProps) {
    const [spesialis, setSpesialis] = useState("semua");
    const [kata, setKata] = useState("");

    const spesialisasi = useMemo(
        () =>
            Array.from(new Set(dokter.map((item) => item.spesialisasi).filter(Boolean))).sort(
                formatterSpesialis.compare,
            ),
        [dokter],
    );

    const hasil = useMemo(() => {
        const q = kata.trim().toLowerCase();

        return dokter.filter((item) => {
            const cocokSpesialis = spesialis === "semua" || item.spesialisasi === spesialis;
            const cocokKata =
                !q ||
                item.nama.toLowerCase().includes(q) ||
                item.spesialisasi.toLowerCase().includes(q) ||
                (item.poli ?? "").toLowerCase().includes(q);

            return cocokSpesialis && cocokKata;
        });
    }, [dokter, kata, spesialis]);

    if (dokter.length === 0) {
        return (
            <div className="rounded-2xl border border-primary/10 bg-white px-6 py-14 text-center shadow-[0_24px_60px_-45px_rgba(35,49,21,0.55)] md:px-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-secondary">
                    <Stethoscope aria-hidden className="h-8 w-8" />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-primary">Belum ada data dokter</h2>
                <p className="mx-auto mt-2 max-w-xl text-[16px] leading-relaxed text-tertiary">
                    Daftar dokter akan tampil di sini setelah data dokter ditambahkan melalui dashboard.
                </p>
            </div>
        );
    }

    return (
        <section aria-labelledby="judul-direktori-dokter">
            <div className="grid gap-5 rounded-[28px] bg-base pb-3 md:grid-cols-[auto_minmax(240px,1fr)_auto_minmax(260px,1fr)] md:items-end md:gap-7">
                <h2 id="judul-direktori-dokter" className="text-2xl font-black text-primary md:text-[30px]">
                    Pilih Spesialis
                </h2>

                <div>
                    <label htmlFor="filter-spesialis" className="sr-only">
                        Pilih spesialis dokter
                    </label>
                    <select
                        id="filter-spesialis"
                        value={spesialis}
                        onChange={(event) => setSpesialis(event.target.value)}
                        className="h-16 w-full cursor-pointer rounded-2xl border-2 border-primary/80 bg-white px-5 text-[18px] text-tertiary shadow-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/20 md:text-[20px]"
                    >
                        <option value="semua">Semua Spesialis</option>
                        {spesialisasi.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <label htmlFor="cari-dokter" className="text-2xl font-black text-primary md:text-[30px]">
                    Pilih Dokter
                </label>

                <div className="relative">
                    <input
                        id="cari-dokter"
                        type="search"
                        value={kata}
                        onChange={(event) => setKata(event.target.value)}
                        placeholder="Nama Dokter..."
                        className="h-16 w-full rounded-2xl border-2 border-primary/80 bg-white pl-5 pr-14 text-[18px] text-primary shadow-sm outline-none transition placeholder:text-tertiary/75 focus:border-secondary focus:ring-4 focus:ring-secondary/20 md:text-[20px]"
                    />
                    <Search
                        aria-hidden
                        className="pointer-events-none absolute right-5 top-1/2 h-7 w-7 -translate-y-1/2 text-primary/90"
                    />
                </div>
            </div>

            <p aria-live="polite" className="sr-only">
                {hasil.length} dokter ditemukan
            </p>

            {hasil.length === 0 ? (
                <div className="mt-12 rounded-2xl border border-primary/10 bg-white px-6 py-12 text-center md:px-12">
                    <h3 className="text-xl font-bold text-primary">Dokter tidak ditemukan</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-tertiary">
                        Coba pilih semua spesialis atau gunakan kata kunci nama yang berbeda.
                    </p>
                </div>
            ) : (
                <div className="mt-12 space-y-10 md:mt-14 md:space-y-12">
                    {hasil.map((item) => (
                        <article
                            key={item.id}
                            id={"dokter-" + item.id}
                            className="grid gap-6 rounded-[28px] bg-base md:grid-cols-[320px_minmax(230px,0.8fr)_minmax(420px,1.45fr)] md:items-center md:gap-8 lg:gap-10"
                        >
                            <div className="overflow-hidden rounded-[18px] border border-primary/15 bg-white p-2 shadow-[0_24px_55px_-42px_rgba(35,49,21,0.85)]">
                                <FotoDokter nama={item.nama} foto={item.foto} />
                            </div>

                            <div className="md:py-4">
                                <h3 className="text-[24px] font-black leading-tight text-primary md:text-[26px]">
                                    {item.nama}
                                </h3>
                                <p className="mt-3 break-words text-[15px] font-black uppercase tracking-[0.28em] text-secondary md:text-[17px]">
                                    {item.spesialisasi}
                                </p>
                                {item.poli && (
                                    <p className="mt-3 inline-flex min-h-10 items-center rounded-full bg-white px-4 text-sm font-bold text-primary ring-1 ring-primary/10">
                                        {item.poli}
                                    </p>
                                )}
                                <Link
                                    href={"/dokter/" + item.id}
                                    className="mt-4 inline-flex min-h-10 items-center text-[15px] font-semibold text-primary underline underline-offset-4 transition hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
                                >
                                    Detail Profil
                                </Link>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center gap-2 text-primary">
                                    <CalendarDays aria-hidden className="h-5 w-5 text-secondary" />
                                    <h4 className="text-[24px] font-black leading-none">Jadwal</h4>
                                </div>
                                <JadwalMingguanDokter jadwal={item.jadwalMingguan} />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
