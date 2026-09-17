import { Fragment } from "react";
import { BsGeoAltFill } from "react-icons/bs";
import { IoIosCalendar } from "react-icons/io";
import { IoTimeSharp } from "react-icons/io5";
import type { PosyanduPublik } from "@/lib/konten/posyandu";

/** Kalimat cadangan saat admin belum mengisi keterangan singkat. Kartu di
 *  desain selalu punya satu baris di bawah nama; membiarkannya kosong membuat
 *  tinggi kartu di satu baris grid tidak sama. */
const DESKRIPSI_CADANGAN = "Informasi Detail Posyandu";

/** Huruf pengganti foto: diambil dari kata pembeda, bukan huruf pertama nama.
 *  Hampir semua nama diawali kata "Posyandu", jadi huruf pertama akan membuat
 *  seluruh kartu tanpa foto bertuliskan "P" yang sama. */
function inisial(nama: string): string {
    const kata = nama.trim().split(/\s+/).filter(Boolean);
    const pembeda = kata.find((k) => k.toLowerCase() !== "posyandu") ?? kata[0] ?? "";
    return pembeda.charAt(0).toUpperCase();
}

function BarisInfo({ ikon, teks }: { ikon: React.ReactNode; teks: string }) {
    return (
        <li className="flex items-center gap-2 @lg:gap-[15px]">
            <span aria-hidden="true" className="shrink-0 text-secondary [&>svg]:size-4 @sm:[&>svg]:size-[18px] @lg:[&>svg]:size-5">
                {ikon}
            </span>
            <span className="min-w-0 text-[13px] leading-snug tracking-[-0.02em] text-tertiary @sm:text-[14px]">
                {teks}
            </span>
        </li>
    );
}

/**
 * Satu posyandu: teks di kiri, foto di kanan — tata letak itu dipertahankan
 * sampai layar terkecil (frame Mobile Figma), fotonya yang mengecil, bukan
 * ditumpuk ke atas teks.
 *
 * Ukuran mengikuti Figma node `12:214`: kartu selebar 539px dengan radius 30,
 * padding 27×25, judul 30px, teks info 14px, ikon 20px, jarak 15px, foto
 * 193×189.
 *
 * Ukuran diatur lewat container query (`@container`, `@sm:`, `@lg:`) — lebar
 * KARTU, bukan lebar layar. Grid berubah 1 → 2 → 3 kolom, sehingga lebar
 * kartu naik-turun tidak searah dengan layar: 335px di ponsel 375, 280px di
 * 3 kolom 1024, 400px di 1440, 550px di 1920. Breakpoint layar sempat dipakai
 * dan membuat kolom teks tinggal ±70px di 1024 dan judul pecah di 1440.
 *   - dasar (< 320px, mis. 3 kolom di 1024): foto 80px agar kolom teks cukup.
 *   - `@xs` (≥ 320px): ukuran frame Mobile Figma (foto 100×98, ikon 16).
 *   - `@sm` (≥ 384px): ukuran antara.
 *   - `@lg` (≥ 512px): nilai desktop Figma persis.
 */
export default function KartuPosyandu({ posyandu }: { posyandu: PosyanduPublik }) {
    const { nama, deskripsi, foto, desa, jadwal } = posyandu;

    return (
        <article className="@container h-full">
          <div className="flex h-full gap-3 rounded-[20px] border border-tertiary/50 bg-[#d9d9d9]/20 p-4 transition-all duration-300 hover:border-secondary/60 hover:shadow-[0_18px_40px_-24px_rgba(35,49,21,0.35)] @sm:gap-4 @sm:p-5 @lg:gap-5 @lg:rounded-[30px] @lg:px-[27px] @lg:py-[25px]">
            <div className="flex min-w-0 flex-1 flex-col">
                {/* #2b3d4f: warna judul dari Figma, tidak ada padanannya di token proyek. */}
                <h3 className="text-[16px] font-black leading-tight tracking-[-0.02em] text-[#2b3d4f] @xs:text-[17px] @sm:text-[22px] @lg:text-[30px]">
                    {nama}
                </h3>
                <p className="mt-0.5 text-[12px] font-bold tracking-[-0.02em] text-tertiary @sm:text-[13px] @lg:text-[14px]">
                    {deskripsi ?? DESKRIPSI_CADANGAN}
                </p>

                <ul className="mt-3 flex flex-col gap-1.5 @sm:mt-4 @sm:gap-2.5 @lg:mt-5 @lg:gap-[15px]">
                    {desa && <BarisInfo ikon={<BsGeoAltFill />} teks={desa} />}
                    {/* Hari dan jam dirender berpasangan per jadwal. Merender semua
                        baris hari lalu semua baris jam membuat posyandu dengan dua
                        jadwal tampil "Senin ke-1, Senin ke-3, 08:00, 13:00" —
                        warga tidak bisa tahu jam mana milik minggu mana. */}
                    {jadwal.map((j) => (
                        <Fragment key={j.id}>
                            <BarisInfo ikon={<IoIosCalendar />} teks={j.labelJadwal} />
                            {j.labelWaktu && <BarisInfo ikon={<IoTimeSharp />} teks={j.labelWaktu} />}
                        </Fragment>
                    ))}
                </ul>
            </div>

            {foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={foto.srcMini ?? foto.src}
                    alt={foto.alt}
                    loading="lazy"
                    className="w-[80px] min-h-[80px] shrink-0 self-stretch rounded-xl object-cover @xs:w-[100px] @xs:min-h-[98px] @sm:w-[130px] @sm:min-h-[130px] @lg:w-[193px] @lg:min-h-[189px] @lg:rounded-2xl"
                />
            ) : (
                <div
                    aria-hidden="true"
                    className="grid w-[80px] min-h-[80px] shrink-0 self-stretch place-items-center rounded-xl bg-tertiary/10 text-[22px] font-black text-secondary @xs:w-[100px] @xs:min-h-[98px] @xs:text-[26px] @sm:w-[130px] @sm:min-h-[130px] @sm:text-[34px] @lg:w-[193px] @lg:min-h-[189px] @lg:rounded-2xl @lg:text-[48px]"
                >
                    {inisial(nama)}
                </div>
            )}
          </div>
        </article>
    );
}
