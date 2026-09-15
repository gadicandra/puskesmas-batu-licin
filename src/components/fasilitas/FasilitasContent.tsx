"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
    Building2,
    CheckCircle2,
    DoorOpen,
    Droplets,
    HeartPulse,
    ParkingCircle,
    Search,
    type LucideIcon,
} from "lucide-react";

import Container from "@/components/layout/Container/Container";
import { type FasilitasPublik, type KategoriFasilitas } from "@/lib/konten/fasilitas";

const FOTO_FASILITAS = "/laboratorium_2x.webp";

type FasilitasTampilan = {
    id: string;
    nama: string;
    kategori: KategoriFasilitas;
    labelKategori: string;
    deskripsi: string;
    jumlah: number | null;
    keteranganJumlah: string;
    foto: string | null;
    alt: string;
};

type KelompokFasilitas = {
    id: FasilitasTampilan["kategori"];
    label: string;
    ringkasan: string;
    ikon: LucideIcon;
    items: FasilitasTampilan[];
};

type FilterKategori = "semua" | FasilitasTampilan["kategori"];

const fallbackFasilitas: FasilitasTampilan[] = [
    ...[
        "Pendaftaran & Rekam Medik",
        "Klaster Kesehatan Dewasa & Lansia (Pelayanan Umum)",
        "Gudang Umum",
        "Ruang Tunggu",
        "KM/WC Pasien (terpisah L/P)",
        "Pelayanan Kesehatan Ibu",
        "Gawat Darurat (UGD)",
        "Pelayanan Kesehatan Anak & Remaja (+ Imunisasi)",
        "Keluarga Berencana",
        "Kesehatan Gigi & Mulut",
        "Geriatri (Usila)",
        "Apotek",
        "Gudang Obat",
        "Penyimpanan Vaksin",
        "Laboratorium Medis",
        "KM/WC Petugas",
        "Klaster Penanggulangan Penyakit Menular & Kesling",
        "ASI / Laktasi",
        "KIE / Promosi Kesehatan",
        "KM/WC Persalinan",
        "Persalinan",
        "Rawat Pasca Persalinan",
        "Istirahat Petugas",
        "Infeksius (TB/HIV)",
        "Tindakan",
        "Fisioterapi",
        "Pelayanan Kesehatan Tradisional",
        "Laboratorium Lingkungan",
        "Cuci Linen",
        "Jaga Perawat / Nurse Station",
    ].map((nama, index) => buatFallback(nama, "ruang", "Ruang Pelayanan", 1, index)),
    ...[
        "Ruang Kepala Puskesmas",
        "Ruang Rapat/Diskusi",
        "Ruang Administrasi",
    ].map((nama, index) => buatFallback(nama, "kantor", "Ruang Kantor", 1, index)),
    ...([
        ["Parkir Roda 4", 1],
        ["Parkir Roda 2", 1],
        ["Parkir Ambulance", 1],
        ["Ruang Sanitasi", 1],
        ["Rumah Dinas Tenaga Kesehatan II", 1],
        ["Parkir Pusling Darat", 1],
        ["Ruang Jaga Dokter/Perawat", 1],
        ["Air Minum", 1],
        ["Buku Register Pengaduan Masyarakat", 1],
        ["Buku Tamu Umum", 1],
        ["Denah Jalur Evakuasi", 1],
        ["Kipas Angin Ruang Tunggu", 2],
        ["Kursi Roda", 1],
        ["Kursi Tunggu", 12],
        ["Loket Khusus (Disabilitas, Lansia, Balita, Bumil)", 1],
        ["Mesin Antrian", 1],
        ["P3K", 1],
        ["Pengisi Daya (Charging Station)", 1],
        ["Petugas Front Office", null],
        ["Pintu Masuk", 1],
        ["Printer & Fotocopy", 1],
        ["Ruang Ibadah", 1],
        ["Toilet Wanita + Handrail", 2],
        ["Toilet Pria + Handrail", 2],
        ["Wastafel", 2],
        ["CCTV", null],
        ["Freestanding Handrail", null],
        ["Layanan Pengaduan", null],
        ["Sound System", null],
        ["Televisi (info kesehatan)", null],
        ["Lahan Parkir", null],
        ["Titik Kumpul", null],
        ["Wifi", null],
    ] satisfies [string, number | null][]).map(([nama, jumlah], index) =>
        buatFallback(nama, "penunjang", "Sarana Penunjang", jumlah, index),
    ),
];

function buatFallback(
    nama: string,
    kategori: FasilitasTampilan["kategori"],
    labelKategori: string,
    jumlah: number | null,
    index: number,
): FasilitasTampilan {
    return {
        id: `${kategori}-${index}-${nama}`,
        nama,
        kategori,
        labelKategori,
        jumlah,
        keteranganJumlah: jumlah === null ? "Tersedia" : `${jumlah} unit`,
        foto: FOTO_FASILITAS,
        alt: `Ilustrasi fasilitas ${nama}`,
        deskripsi: deskripsiFasilitas(nama, labelKategori),
    };
}

function deskripsiFasilitas(nama: string, labelKategori: string) {
    const teks = nama.toLowerCase();

    if (teks.includes("laktasi") || teks === "asi" || teks.includes("asi /")) return "Ruang nyaman untuk ibu menyusui atau memerah ASI dengan lebih tenang saat berada di area Puskesmas.";
    if (teks.includes("gawat") || teks.includes("ugd")) return "Ruang penanganan awal untuk kondisi darurat yang membutuhkan respons cepat dari tenaga kesehatan.";
    if (teks.includes("tunggu")) return "Area tunggu pasien yang disiapkan agar alur pelayanan tetap tertib dan mudah dipantau.";
    if (teks.includes("parkir")) return "Area parkir yang mendukung akses kendaraan pasien, keluarga, petugas, dan kendaraan pelayanan.";
    if (teks.includes("toilet") || teks.includes("wc") || teks.includes("wastafel")) return "Fasilitas kebersihan untuk menjaga kenyamanan, sanitasi, dan akses yang lebih ramah bagi pengunjung.";
    if (teks.includes("laboratorium")) return "Ruang pemeriksaan penunjang untuk membantu proses diagnosis dan tindak lanjut pelayanan kesehatan.";
    if (teks.includes("apotek") || teks.includes("obat") || teks.includes("vaksin")) return "Area pengelolaan obat dan vaksin agar pelayanan farmasi berjalan tertib, aman, dan mudah dilacak.";
    if (teks.includes("pengaduan") || teks.includes("front office") || teks.includes("tamu")) return "Sarana penerimaan informasi, bantuan awal, dan masukan masyarakat terhadap pelayanan Puskesmas.";
    if (labelKategori === "Ruang Kantor") return "Ruang kerja internal untuk koordinasi, administrasi, dan pengelolaan pelayanan harian Puskesmas.";
    if (labelKategori === "Sarana Penunjang") return "Sarana pendukung yang membantu kenyamanan, keamanan, dan kelancaran kunjungan masyarakat.";
    return "Ruang pelayanan yang mendukung pemeriksaan, konsultasi, dan tindak lanjut kebutuhan kesehatan masyarakat.";
}

function dariCms(fasilitas: FasilitasPublik[]): FasilitasTampilan[] {
    return fasilitas.map((item) => ({
        id: String(item.id),
        nama: item.nama,
        kategori: item.kategori,
        labelKategori: item.labelKategori,
        jumlah: item.jumlah,
        keteranganJumlah: item.jumlah === null ? "Tersedia" : `${item.jumlah} unit`,
        foto: item.foto?.srcMini ?? item.foto?.srcKartu ?? item.foto?.src ?? FOTO_FASILITAS,
        alt: item.foto?.alt ?? `Foto ${item.nama}`,
        deskripsi: item.deskripsi ?? deskripsiFasilitas(item.nama, item.labelKategori),
    }));
}

function kelompokkan(items: FasilitasTampilan[]): KelompokFasilitas[] {
    const definisi: Omit<KelompokFasilitas, "items">[] = [
        { id: "ruang", label: "Ruang Pelayanan", ringkasan: "Ruang pemeriksaan dan pelayanan langsung untuk pasien.", ikon: DoorOpen },
        { id: "kantor", label: "Ruang Kantor", ringkasan: "Ruang koordinasi dan administrasi internal Puskesmas.", ikon: Building2 },
        { id: "alat", label: "Alat Kesehatan", ringkasan: "Peralatan pendukung pemeriksaan dan tindak lanjut klinis.", ikon: HeartPulse },
        { id: "kendaraan", label: "Kendaraan", ringkasan: "Kendaraan pendukung akses layanan dan kegiatan lapangan.", ikon: ParkingCircle },
        { id: "penunjang", label: "Sarana Penunjang", ringkasan: "Fasilitas pendukung kenyamanan, aksesibilitas, dan keamanan.", ikon: Droplets },
    ];

    return definisi
        .map((kelompok) => ({ ...kelompok, items: items.filter((item) => item.kategori === kelompok.id) }))
        .filter((kelompok) => kelompok.items.length > 0);
}

function cocokDenganKata(item: FasilitasTampilan, kata: string) {
    const q = kata.trim().toLowerCase();
    if (!q) return true;

    return (
        item.nama.toLowerCase().includes(q) ||
        item.labelKategori.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q)
    );
}

export default function FasilitasContent({ fasilitas }: { fasilitas: FasilitasPublik[] }) {
    const [kata, setKata] = useState("");
    const [kategoriAktif, setKategoriAktif] = useState<FilterKategori>("semua");

    const daftar = useMemo(
        () => (fasilitas.length > 0 ? dariCms(fasilitas) : fallbackFasilitas),
        [fasilitas],
    );

    const kelompokSemua = useMemo(() => kelompokkan(daftar), [daftar]);
    const hasil = useMemo(
        () =>
            daftar.filter(
                (item) =>
                    (kategoriAktif === "semua" || item.kategori === kategoriAktif) &&
                    cocokDenganKata(item, kata),
            ),
        [daftar, kata, kategoriAktif],
    );
    const kelompok = useMemo(() => kelompokkan(hasil), [hasil]);
    const totalRuang = daftar.filter((item) => item.kategori === "ruang" || item.kategori === "kantor").length;
    const totalPenunjang = daftar.filter((item) => item.kategori === "penunjang").length;
    const filterKategori = [
        { id: "semua" as const, label: "Semua", jumlah: daftar.length },
        ...kelompokSemua.map((bagian) => ({ id: bagian.id, label: bagian.label, jumlah: bagian.items.length })),
    ];

    return (
        <Container sectionClassName="pt-6 pb-14 md:pt-8 md:pb-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
                <div>
                    <h2 className="max-w-2xl text-3xl font-black leading-tight text-primary md:text-4xl">Fasilitas Kesehatan</h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-tertiary-700">
                        Daftar sarana dan ruangan pelayanan UPTD Puskesmas Batulicin yang mendukung pelayanan kesehatan, administrasi, aksesibilitas, dan kenyamanan pengunjung.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-28px_rgba(35,49,21,0.45)] ring-1 ring-primary/10"><p className="text-2xl font-black text-primary">{daftar.length}</p><p className="mt-1 text-sm font-semibold text-tertiary-700">Total fasilitas</p></div>
                    <div className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-28px_rgba(35,49,21,0.45)] ring-1 ring-primary/10"><p className="text-2xl font-black text-primary">{totalRuang}</p><p className="mt-1 text-sm font-semibold text-tertiary-700">Ruang tersedia</p></div>
                    <div className="col-span-2 rounded-2xl bg-primary p-4 text-white shadow-[0_20px_40px_-28px_rgba(35,49,21,0.7)] sm:col-span-1"><p className="text-2xl font-black">{totalPenunjang}</p><p className="mt-1 text-sm font-semibold text-white/80">Sarana penunjang</p></div>
                </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-3 shadow-[0_24px_70px_-46px_rgba(35,49,21,0.65)] ring-1 ring-primary/10 md:mt-10 md:p-4">
                <label htmlFor="cari-fasilitas" className="sr-only">Cari fasilitas kesehatan</label>
                <div className="relative">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary/60" />
                    <input
                        id="cari-fasilitas"
                        type="search"
                        value={kata}
                        onChange={(event) => setKata(event.target.value)}
                        placeholder="Cari fasilitas, misalnya ASI, UGD, parkir, toilet..."
                        className="h-12 w-full rounded-2xl border border-primary/10 bg-base pl-12 pr-4 text-[16px] font-medium text-primary placeholder:text-tertiary/70 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                    />
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter kategori fasilitas">
                    {filterKategori.map((filter) => {
                        const aktif = kategoriAktif === filter.id;
                        return (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setKategoriAktif(filter.id)}
                                className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
                                    aktif
                                        ? "bg-primary text-white shadow-[0_14px_30px_-20px_rgba(35,49,21,0.9)]"
                                        : "bg-primary/5 text-primary hover:bg-secondary/15"
                                }`}
                            >
                                {filter.label} <span className={aktif ? "text-white/70" : "text-tertiary-700"}>({filter.jumlah})</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <p aria-live="polite" className="sr-only">{hasil.length} fasilitas ditemukan</p>

            {hasil.length === 0 ? (
                <div className="mt-10 rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-[0_24px_60px_-44px_rgba(35,49,21,0.55)]">
                    <p className="text-lg font-black text-primary">Fasilitas tidak ditemukan</p>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-tertiary-700">
                        Coba kata lain seperti parkir, UGD, toilet, ASI, atau pilih kategori Semua.
                    </p>
                </div>
            ) : (
                <div className="mt-10 space-y-12 md:mt-14">
                    {kelompok.map((bagian) => {
                        const Icon = bagian.ikon;
                        return (
                            <section key={bagian.id} aria-labelledby={`fasilitas-${bagian.id}`}>
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-[0_14px_26px_-18px_rgba(105,118,68,0.9)]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                                        <div><h3 id={`fasilitas-${bagian.id}`} className="text-2xl font-black text-primary">{bagian.label}</h3><p className="mt-1 max-w-2xl text-sm leading-relaxed text-tertiary-700">{bagian.ringkasan}</p></div>
                                    </div>
                                    <p className="text-sm font-bold text-secondary">{bagian.items.length} item</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                                    {bagian.items.map((item) => (
                                        <article key={item.id} className="group overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-42px_rgba(35,49,21,0.55)] ring-1 ring-primary/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-38px_rgba(35,49,21,0.65)]">
                                            <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                                                {item.foto ? <Image src={item.foto} alt={item.alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center bg-secondary/10"><Building2 className="h-10 w-10 text-secondary sm:h-12 sm:w-12" aria-hidden="true" /></div>}
                                                <div className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black leading-none text-primary shadow-lg sm:right-3 sm:top-3 sm:px-3 sm:text-xs">
                                                    {item.keteranganJumlah}
                                                </div>
                                            </div>
                                            <div className="p-3 sm:p-5">
                                                <div className="flex items-start gap-1.5 sm:gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary sm:mt-1 sm:h-4 sm:w-4" aria-hidden="true" /><h4 className="text-sm font-black leading-snug text-primary sm:text-lg">{item.nama}</h4></div>
                                                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-tertiary-700 sm:mt-3 sm:line-clamp-3 sm:text-sm">
                                                    {item.deskripsi}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </Container>
    );
}
