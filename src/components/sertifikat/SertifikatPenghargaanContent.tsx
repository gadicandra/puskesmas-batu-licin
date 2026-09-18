import Image from "next/image";
import { BsFillTrophyFill, BsStar, BsCheckCircle, BsFillFileEarmarkFill } from "react-icons/bs";
import { IoMedalOutline } from "react-icons/io5";
import { IoMdOpen } from "react-icons/io";
import { AiOutlineCalendar } from "react-icons/ai";
import { dokumenSertifikat, urlDokumen, type DokumenSertifikat } from "./data";
import styles from "./sertifikat.module.css";

function DaftarDokumen({ items, akreditasi = false }: { items: DokumenSertifikat[]; akreditasi?: boolean }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-primary/20 px-6 py-9 text-primary md:px-10">
                <p className="text-lg font-bold">{akreditasi ? "Dokumen akreditasi belum tersedia" : "Piagam penghargaan belum tersedia"}</p>
                <p className="mt-2 max-w-[65ch] leading-relaxed">{akreditasi ? "Belum ada sertifikat akreditasi yang ditampilkan pada halaman ini. Status dan masa berlaku akreditasi dapat dilihat pada sertifikat resminya setelah tersedia." : "Belum ada dokumen penghargaan yang ditampilkan pada halaman ini."}</p>
            </div>
        );
    }
    return (
        <div className="grid gap-5">
            {items.map((item) => (
                <article key={item.file} className={[styles.document, akreditasi ? "bg-primary" : "bg-secondary", "rounded-2xl p-5 text-latar md:p-8"].join(" ")}>
                    <div className="min-w-0">
                        <div className="mb-4 flex items-center gap-3">
                            {akreditasi ? <IoMedalOutline className="size-9 shrink-0" aria-hidden="true" /> : <BsFillTrophyFill className="size-8 shrink-0" aria-hidden="true" />}
                            <span className="font-bold">{item.predikat}</span>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight md:text-3xl">{item.judul}</h3>
                        <p className="mt-3 max-w-[65ch] leading-relaxed">{item.penerbit}</p>
                        {/* <dl> hanya boleh berisi <dt>/<dd> atau <div> yang langsung
                            membungkus keduanya. Sebelumnya ikon dan satu <div> lagi ikut
                            menjadi anak, sehingga <dt>/<dd> tidak lagi dianggap bagian
                            dari daftar. Ikon dipindah ke dalam <dt>, dan nilainya diberi
                            indentasi selebar ikon + jarak (24px + 12px) agar tampilannya
                            tetap sama. */}
                        <dl className="my-6 grid gap-4 text-base">
                            <div>
                                <dt className="flex items-center gap-3 text-sm">
                                    <AiOutlineCalendar className="size-6 shrink-0" aria-hidden="true" />
                                    {item.tanggal ? "Tanggal terbit" : "Tahun"}
                                </dt>
                                <dd className="pl-9 font-bold">{item.tanggal ?? item.tahun}</dd>
                            </div>
                            <div>
                                <dt className="flex items-center gap-3 text-sm">
                                    <BsStar className="size-6 shrink-0" aria-hidden="true" />
                                    Kategori
                                </dt>
                                <dd className="pl-9 font-bold">{akreditasi ? "Sertifikat Akreditasi" : "Piagam Penghargaan"}</dd>
                            </div>
                        </dl>
                        <a href={urlDokumen(item.file)} target="_blank" rel="noopener noreferrer" className={styles.documentLink}>
                            <BsFillFileEarmarkFill className="size-5" aria-hidden="true" />
                            {akreditasi ? "Lihat Sertifikat" : "Lihat Piagam"}
                            <IoMdOpen className="size-5" aria-hidden="true" />
                            <span className="sr-only">: {item.judul} (buka tab baru)</span>
                        </a>
                    </div>
                    <div className="relative aspect-[1.43] w-full self-center overflow-hidden rounded-lg bg-latar">
                        <Image src={urlDokumen(item.file)} alt={[item.predikat, item.judul, "Puskesmas Batulicin", item.tahun].join(", ")} fill sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 90vw" className="object-contain" />
                    </div>
                </article>
            ))}
        </div>
    );
}

export default function SertifikatPenghargaanContent() {
    const akreditasi = dokumenSertifikat.filter((item) => item.kategori === "akreditasi");
    const penghargaan = dokumenSertifikat.filter((item) => item.kategori === "penghargaan");
    const peringkatPertama = penghargaan.filter((item) => item.predikat === "Terbaik I" || item.predikat === "Juara Pertama").length;
    return (
        <div className={styles.content + " mx-auto w-full max-w-6xl text-primary"}>
            <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed md:text-2xl">Komitmen kami terhadap standar pelayanan kesehatan berkualitas untuk masyarakat.</p>
            <section aria-label="Ringkasan dokumen" className={styles.summary}>
                <div className={[styles.summaryCard, styles.summaryLeft, "bg-secondary text-latar"].join(" ")}>
                    <BsFillTrophyFill className="mx-auto size-9" aria-hidden="true" />
                    <p className="mt-4 text-lg font-bold">Piagam Penghargaan</p>
                    <p className="my-3 text-5xl font-bold tabular-nums">{penghargaan.length}</p>
                    <p>Dokumen penghargaan</p>
                </div>
                <div className={[styles.summaryCard, styles.summaryCenter, "bg-primary text-latar"].join(" ")}>
                    <IoMedalOutline className="mx-auto size-12" aria-hidden="true" />
                    <p className="mt-3 text-lg font-bold">Sertifikat Akreditasi</p>
                    <p className="my-3 text-5xl font-bold tabular-nums">{akreditasi.length}</p>
                    <p>{akreditasi.length ? "Dokumen akreditasi" : "Dokumen belum tersedia"}</p>
                </div>
                <div className={[styles.summaryCard, styles.summaryRight, "bg-secondary text-latar"].join(" ")}>
                    <BsFillTrophyFill className="mx-auto size-9" aria-hidden="true" />
                    <p className="mt-4 text-lg font-bold">Peringkat Pertama</p>
                    <p className="my-3 text-5xl font-bold tabular-nums">{peringkatPertama}</p>
                    <p>Terbaik I / Juara Pertama</p>
                </div>
            </section>
            <nav aria-label="Kategori dokumen" className={styles.categories}>
                <a href="#akreditasi">Sertifikat Akreditasi <span>({akreditasi.length})</span></a>
                <a href="#penghargaan">Piagam Penghargaan <span>({penghargaan.length})</span></a>
            </nav>
            <section id="akreditasi" className="scroll-mt-28">
                <h2 className="mb-5 text-2xl font-bold md:text-3xl">Sertifikat Akreditasi</h2>
                <DaftarDokumen items={akreditasi} akreditasi />
            </section>
            <section id="penghargaan" className="mt-14 scroll-mt-28 md:mt-20">
                <h2 className="text-2xl font-bold md:text-3xl">Piagam Penghargaan</h2>
                <p className="mb-7 mt-3 max-w-[65ch] leading-relaxed">Penghargaan atas capaian pelayanan Puskesmas Batulicin di tingkat Kabupaten Tanah Bumbu.</p>
                <DaftarDokumen items={penghargaan} />
            </section>
            <aside className="mt-10 rounded-2xl bg-secondary/15 p-6 md:mt-14 md:p-9">
                <h2 className="flex items-center gap-3 text-xl font-bold md:text-2xl"><BsCheckCircle className="size-7 shrink-0" aria-hidden="true" />Tentang dokumen di halaman ini</h2>
                <p className="mt-4 max-w-[65ch] leading-relaxed">Piagam penghargaan mencatat capaian pada kategori tertentu. Piagam tersebut, termasuk penghargaan lomba mutu, bukan sertifikat penetapan status akreditasi.</p>
                <p className="mt-3 max-w-[65ch] leading-relaxed">Buka masing-masing dokumen untuk membaca rincian penghargaan, penerbit, dan tahun yang tercantum.</p>
            </aside>
        </div>
    );
}
