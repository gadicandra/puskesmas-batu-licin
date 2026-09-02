import { Clock } from "lucide-react";
import type { DokterPublik } from "@/lib/konten/dokter";

/** Kartu satu dokter: foto, nama, spesialisasi, lalu tabel jadwal mingguan.
 *
 *  Tujuh harinya datang lengkap dari `jadwalMingguan` — komponen ini tidak
 *  perlu menambal hari yang kosong sendiri. */
export default function KartuDokter({ dokter }: { dokter: DokterPublik }) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white">
            <div className="aspect-[4/3] w-full overflow-hidden bg-base">
                {dokter.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={dokter.foto.src}
                        alt={dokter.foto.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5">
                        <span className="text-3xl font-bold text-primary/30" aria-hidden>
                            {dokter.nama.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[16px] font-bold leading-snug text-primary">{dokter.nama}</h3>
                <p className="mt-0.5 text-sm font-semibold text-secondary">{dokter.spesialisasi}</p>

                <div className="mt-4 overflow-hidden rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2 bg-base px-3 py-2.5">
                        <Clock aria-hidden className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-semibold text-primary">
                            Jadwal Praktik Mingguan
                        </span>
                    </div>
                    <table className="w-full text-sm">
                        <caption className="sr-only">
                            Jadwal praktik mingguan {dokter.nama}
                        </caption>
                        <tbody>
                            {dokter.jadwalMingguan.map((b) => (
                                <tr key={b.kodeHari} className="border-t border-primary/10">
                                    <th
                                        scope="row"
                                        className="px-3 py-2 text-left font-medium text-tertiary"
                                    >
                                        {b.hari}
                                    </th>
                                    <td
                                        className={`px-3 py-2 text-right font-semibold ${b.libur ? "text-secondary" : "text-primary"
                                            }`}
                                    >
                                        {b.libur ? "Libur" : b.jam}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
    );
}
