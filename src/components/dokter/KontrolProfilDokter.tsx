"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { DokterPublik } from "@/lib/konten/dokter";

const urutIndonesia = new Intl.Collator("id-ID", { sensitivity: "base" });

type KontrolProfilDokterProps = {
    dokter: DokterPublik[];
    dokterAktif?: DokterPublik;
};

export default function KontrolProfilDokter({ dokter, dokterAktif }: KontrolProfilDokterProps) {
    const router = useRouter();
    const [spesialis, setSpesialis] = useState(dokterAktif?.spesialisasi ?? "semua");
    const [kata, setKata] = useState(dokterAktif?.nama ?? "");

    const spesialisasi = useMemo(
        () => Array.from(new Set(dokter.map((item) => item.spesialisasi))).sort(urutIndonesia.compare),
        [dokter],
    );

    const opsiDokter = useMemo(() => {
        const daftar = spesialis === "semua" ? dokter : dokter.filter((item) => item.spesialisasi === spesialis);
        return [...daftar].sort((a, b) => urutIndonesia.compare(a.nama, b.nama));
    }, [dokter, spesialis]);

    const cariDokter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const q = kata.trim().toLowerCase();
        const cocok = opsiDokter.find((item) => item.nama.toLowerCase() === q) ??
            opsiDokter.find((item) => item.nama.toLowerCase().includes(q));

        if (cocok) {
            router.push("/dokter/" + cocok.id);
            return;
        }

        router.push("/dokter");
    };

    return (
        <form
            onSubmit={cariDokter}
            className="grid gap-5 rounded-[28px] bg-base pb-3 md:grid-cols-[auto_minmax(240px,1fr)_auto_minmax(260px,1fr)] md:items-end md:gap-7"
        >
            <label htmlFor="filter-spesialis-detail" className="text-2xl font-black text-primary md:text-[30px]">
                Pilih Spesialis
            </label>

            <select
                id="filter-spesialis-detail"
                value={spesialis}
                onChange={(event) => {
                    setSpesialis(event.target.value);
                    setKata("");
                }}
                className="h-16 w-full cursor-pointer rounded-2xl border-2 border-primary/80 bg-white px-5 text-[18px] text-tertiary shadow-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/20 md:text-[20px]"
            >
                <option value="semua">Semua Spesialis</option>
                {spesialisasi.map((item) => (
                    <option key={item} value={item}>
                        {item}
                    </option>
                ))}
            </select>

            <label htmlFor="cari-dokter-detail" className="text-2xl font-black text-primary md:text-[30px]">
                Pilih Dokter
            </label>

            <div className="relative">
                <input
                    id="cari-dokter-detail"
                    list="daftar-dokter-detail"
                    type="search"
                    value={kata}
                    onChange={(event) => setKata(event.target.value)}
                    placeholder="Nama Dokter..."
                    autoComplete="off"
                    className="h-16 w-full rounded-2xl border-2 border-primary/80 bg-white pl-5 pr-14 text-[18px] text-primary shadow-sm outline-none transition placeholder:text-tertiary/75 focus:border-secondary focus:ring-4 focus:ring-secondary/20 md:text-[20px]"
                />
                <datalist id="daftar-dokter-detail">
                    {opsiDokter.map((item) => (
                        <option key={item.id} value={item.nama} />
                    ))}
                </datalist>
                <button
                    type="submit"
                    aria-label="Cari dokter"
                    className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl text-primary transition hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                    <Search aria-hidden className="h-7 w-7" />
                </button>
            </div>
        </form>
    );
}
