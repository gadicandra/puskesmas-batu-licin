/** Pilihan "simpan apa adanya" pada form unggah berkas.
 *
 *  Bacaannya dibalik dari nama teknisnya dengan sengaja: yang dicentang adalah
 *  perkecualiannya, bukan perilaku normalnya. Sebagian besar unggahan adalah
 *  foto dan gambar latar, dan untuk itu jawabannya selalu sama — jadi jangan
 *  membuat staf memutuskan sesuatu setiap kali mengunggah foto.
 *
 *  Dipakai di dua tempat (Galeri Gambar dan jendela Pilih Gambar), karena itu
 *  kalimatnya ditaruh di satu berkas: kalau berbeda di dua tempat, staf akan
 *  mengira keduanya melakukan hal yang berbeda. */
export default function OpsiBerkasAsli({ awal = false }: { awal?: boolean }) {
    return (
        <div>
            <label className="flex min-h-[44px] items-center gap-3 text-sm font-medium text-primary">
                <input
                    type="checkbox"
                    name="pertahankanAsli"
                    value="1"
                    defaultChecked={awal}
                    className="h-5 w-5 shrink-0 rounded border-primary/30 accent-[var(--color-secondary)]"
                />
                Ini berkas dokumen — simpan apa adanya
            </label>
            <p className="mt-1 text-xs leading-relaxed text-tertiary">
                Centang untuk sertifikat, piagam, atau surat yang perlu diunduh dan dicetak.
                Biarkan kosong untuk foto dan gambar latar — gambar akan diperkecil otomatis
                supaya halaman lebih cepat terbuka, tanpa terlihat bedanya.
            </p>
        </div>
    )
}
