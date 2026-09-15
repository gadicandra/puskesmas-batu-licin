import { UserRound } from "lucide-react";
import type { DokterPublik } from "@/lib/konten/dokter";
import { cn } from "@/lib/utils";

type FotoDokterProps = {
    nama: string;
    foto: DokterPublik["foto"];
    className?: string;
};

export function inisialNama(nama: string) {
    return nama
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((bagian) => bagian.charAt(0).toUpperCase())
        .join("");
}

export default function FotoDokter({ nama, foto, className }: FotoDokterProps) {
    return (
        <div className={cn("aspect-[4/3] overflow-hidden rounded-xl bg-[#dcebf5]", className)}>
            {foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={foto.src}
                    alt={foto.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#dcebf5] via-white to-secondary/20">
                    <div className="absolute bottom-0 h-24 w-40 rounded-t-full bg-white/65 blur-2xl" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white text-primary shadow-[0_18px_45px_-26px_rgba(35,49,21,0.8)]">
                        <UserRound aria-hidden className="h-14 w-14 text-secondary" />
                        <span className="sr-only">Foto dokter belum tersedia</span>
                    </div>
                    <span
                        aria-hidden
                        className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white"
                    >
                        {inisialNama(nama)}
                    </span>
                </div>
            )}
        </div>
    );
}
