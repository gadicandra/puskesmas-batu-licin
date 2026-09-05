import { BadgeCheck, BriefcaseMedical, CalendarDays, GraduationCap, Stethoscope } from "lucide-react";
import type { DokterPublik } from "@/lib/konten/dokter";
import FotoDokter from "./FotoDokter";
import JadwalMingguanDokter from "./JadwalMingguanDokter";

type ProfilDokterDetailProps = {
    dokter: DokterPublik;
};

function BarisProfil({ children }: { children: React.ReactNode }) {
    return <li className="leading-relaxed text-primary/85">{children}</li>;
}

export default function ProfilDokterDetail({ dokter }: ProfilDokterDetailProps) {
    return (
        <article className="mt-8 overflow-hidden rounded-[22px] bg-white p-5 shadow-[0_18px_45px_-35px_rgba(35,49,21,0.85)] ring-1 ring-primary/10 md:mt-9 md:p-7">
            <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-[18px] border border-primary/15 bg-white p-2 shadow-[0_24px_55px_-42px_rgba(35,49,21,0.85)]">
                    <FotoDokter nama={dokter.nama} foto={dokter.foto} className="h-full min-h-[260px] md:min-h-[360px]" />
                </div>

                <div className="min-w-0 md:pt-2">
                    <h2 className="break-words text-[26px] font-black leading-tight text-primary md:text-[32px]">
                        {dokter.nama}
                    </h2>
                    <p className="mt-2 break-words text-[15px] font-black uppercase tracking-[0.24em] text-secondary md:text-[18px]">
                        {dokter.spesialisasi}
                    </p>

                    <div className="mt-5 space-y-5 text-[15px] md:text-[16px]">
                        <section aria-labelledby="profil-dokter">
                            <h3 id="profil-dokter" className="text-xl font-black text-primary">
                                Profil
                            </h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <BarisProfil>{dokter.deskripsi ?? "Profil singkat akan tampil setelah data dokter dilengkapi."}</BarisProfil>
                                <BarisProfil>{dokter.poli ? "Bertugas di " + dokter.poli : "Bertugas di UPTD Puskesmas Batulicin."}</BarisProfil>
                            </ul>
                        </section>

                        <section aria-labelledby="pengalaman-dokter">
                            <h3 id="pengalaman-dokter" className="flex items-center gap-2 text-xl font-black text-primary">
                                <BriefcaseMedical aria-hidden className="h-5 w-5 text-secondary" />
                                Pengalaman Bekerja
                            </h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <BarisProfil>Dokter aktif pada layanan kesehatan UPTD Puskesmas Batulicin.</BarisProfil>
                                {dokter.jadwal.length > 0 ? (
                                    <BarisProfil>Memiliki {dokter.jadwal.length} jadwal praktik yang tercatat di sistem.</BarisProfil>
                                ) : (
                                    <BarisProfil>Jadwal praktik belum dilengkapi oleh admin.</BarisProfil>
                                )}
                            </ul>
                        </section>

                        <section aria-labelledby="legalitas-dokter">
                            <h3 id="legalitas-dokter" className="flex items-center gap-2 text-xl font-black text-primary">
                                <BadgeCheck aria-hidden className="h-5 w-5 text-secondary" />
                                Organisasi & Legalitas
                            </h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <BarisProfil>{dokter.nomorSTR ? "Nomor STR: " + dokter.nomorSTR : "Nomor STR belum tersedia di profil publik."}</BarisProfil>
                            </ul>
                        </section>

                        <section aria-labelledby="pendidikan-dokter">
                            <h3 id="pendidikan-dokter" className="flex items-center gap-2 text-xl font-black text-primary">
                                <GraduationCap aria-hidden className="h-5 w-5 text-secondary" />
                                Riwayat Pendidikan
                            </h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                <BarisProfil>{dokter.pendidikan ?? "Riwayat pendidikan belum tersedia di profil publik."}</BarisProfil>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>

            <section aria-labelledby="jadwal-detail-dokter" className="mt-7 md:mt-8">
                <div className="mb-3 flex items-center gap-2 text-primary">
                    <CalendarDays aria-hidden className="h-5 w-5 text-secondary" />
                    <h3 id="jadwal-detail-dokter" className="text-[22px] font-black leading-none md:text-[24px]">
                        Jadwal
                    </h3>
                </div>
                <JadwalMingguanDokter jadwal={dokter.jadwalMingguan} className="md:grid-cols-4 lg:grid-cols-7" />
            </section>
        </article>
    );
}
