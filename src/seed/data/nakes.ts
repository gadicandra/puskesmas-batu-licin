/** Tenaga kesehatan UPTD Puskesmas Batulicin.
 *
 *  Sumber: `data/Data Nakes.xlsx` (dua kolom: Nama, Jabatan).
 *
 *  `jabatan` adalah kategori kasar untuk mengelompokkan & menyaring;
 *  `jabatanLengkap` adalah jabatan fungsional apa adanya dari berkas sumber,
 *  dan itulah yang sebaiknya ditampilkan di situs.
 *
 *  Foto belum tersedia — diunggah menyusul lewat /dashboard/media lalu
 *  ditautkan di form Tenaga Medis. Seed tidak perlu diubah untuk itu.
 *
 *  Catatan: berkas sumber memuat "Anggi Ernia Rahmanita, AM.Keb" dua kali
 *  (Bidan Ahli Madya & Bidan Pelaksana Lanjutan/Mahir). Diambil jenjang yang
 *  lebih tinggi. Mohon dipastikan ke Puskesmas mana yang berlaku. */

import type { MedicalStaff } from '@/payload-types'

type NakesSeed = {
    nama: string
    /** Dipatok ke tipe field select-nya, supaya kode kategori yang salah
     *  ketahuan saat `tsc`, bukan saat seed berjalan. */
    jabatan: MedicalStaff['jabatan']
    jabatanLengkap: string
}

export const NAKES: NakesSeed[] = [
    { nama: "dr. Laurensius Lungan,M.H", jabatan: 'dokter', jabatanLengkap: "Dokter Ahli Muda" },
    { nama: "Isman Santoso, S.Kep.,Ns,.M.M", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Anggi Ernia Rahmanita, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Ahli Madya" },
    { nama: "dr. Mardalena", jabatan: 'dokter', jabatanLengkap: "Dokter Ahli Madya" },
    { nama: "Darmiaty, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Madya" },
    { nama: "Agus Jamili Jain, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Madya" },
    { nama: "Yunida Atikah, S.Kep., Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Madya" },
    { nama: "Hj. Badariah, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Penyelia" },
    { nama: "Kurnain, S.Kep., Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Qosidah Isnani, S.Gz", jabatan: 'gizi', jabatanLengkap: "Nutrisionist Ahli Muda" },
    { nama: "Mahpuzatul Jannah, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Indri Delliyana, SKM", jabatan: 'lainnya', jabatanLengkap: "Penyuluh Kesmas Muda" },
    { nama: "Dewi Mawati,S. Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Penyelia" },
    { nama: "Susi Harianti, AMK", jabatan: 'perawat', jabatanLengkap: "Perawat Penyelia" },
    { nama: "Marta Panjaitan, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Syaiful Fahrin,S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Dyah Kusuma Andriani, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Nurul Hikmah, AMK", jabatan: 'perawat', jabatanLengkap: "Perawat Penyelia" },
    { nama: "Ade Susan Indora, A.Md.AK", jabatan: 'analis', jabatanLengkap: "Pranata Lab. Kes. Penyelia" },
    { nama: "Muhammad Fitriadi, A.MKg", jabatan: 'lainnya', jabatanLengkap: "Terapis Gigi dan Mulut Penyelia" },
    { nama: "Hj. Rabiatul Adawiyah,AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Penyelia" },
    { nama: "Rina Jun Fitri, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Penyelia" },
    { nama: "Ratna Nur Sangadah,AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Penyelia" },
    { nama: "Seisa Indah Septiartini, AMK", jabatan: 'perawat', jabatanLengkap: "Perawat Penyelia" },
    { nama: "dr. Dyni Iswatinnisa", jabatan: 'dokter', jabatanLengkap: "Dokter Ahli Muda" },
    { nama: "Widya Pratiwi, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Muda" },
    { nama: "Siti Aisyah, S.Kep.,Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Pertama" },
    { nama: "Srikayati, S.Kep", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Pertama" },
    { nama: "Harno, SKM", jabatan: 'lainnya', jabatanLengkap: "Penyuluh Kesmas Pertama" },
    { nama: "Rahmayani Maghfirah,S.farm.,Apt.,M.Farm.,", jabatan: 'apoteker', jabatanLengkap: "Apoteker Ahli Muda" },
    { nama: "Sri Suhartini, S.Keb,. Bdn", jabatan: 'bidan', jabatanLengkap: "Bidan Ahli Pertama" },
    { nama: "Putri Anggriani, S.Farm.,Apt", jabatan: 'apoteker', jabatanLengkap: "Apoteker Ahli Pertama" },
    { nama: "dr. Andri Wijanarko", jabatan: 'dokter', jabatanLengkap: "Dokter Ahli Pertama" },
    { nama: "Diana Rosa Indah, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Irmawati Arsyad, A.Md.Kes", jabatan: 'lainnya', jabatanLengkap: "Terapis Gigi dan Mulut Mahir" },
    { nama: "Suhartatik, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Yossy Essy Susanti,S.Tr.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Nur Ayu werdiningsih, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Evi Afyanti DL, AM.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Misnawati, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Pelaksana Lanjutan / Mahir" },
    { nama: "Linda Mariyani, A.Md,Far", jabatan: 'apoteker', jabatanLengkap: "Asisten Apoteker Mahir" },
    { nama: "Amalia, A.Md.AK", jabatan: 'analis', jabatanLengkap: "Pranata Lab. Kes. Mahir" },
    { nama: "Mey Lida Siti Lestari, A.Md.Kes", jabatan: 'sanitarian', jabatanLengkap: "Tenaga Sanitasi Lingkungan Terampil" },
    { nama: "Nour Hayati,A.Md.keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Sartika,A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Fransisca Wulandari, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Mardiati, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Nani Rohayah, SKM", jabatan: 'lainnya', jabatanLengkap: "Kesehatan Masyarakat Ahli Pertama" },
    { nama: "Rahmawati, AMK", jabatan: 'perawat', jabatanLengkap: "Perawat Pelaksana" },
    { nama: "Sri Norliani,A.Md.Gz", jabatan: 'gizi', jabatanLengkap: "Nutrisionis Terampil" },
    { nama: "dr. Nidhya Dwie Mulyasari", jabatan: 'dokter', jabatanLengkap: "Dokter Ahli Pertama" },
    { nama: "Syahriani Nur, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Hijratul Riskhi, A.Md.,Kes", jabatan: 'lainnya', jabatanLengkap: "Perekam Medis Terampil" },
    { nama: "Fahrizal Abdillah, A.Md.Kep", jabatan: 'perawat', jabatanLengkap: "Perawat Terampil" },
    { nama: "Fera Hardiyanti, S.Kep,.Ns", jabatan: 'perawat', jabatanLengkap: "Perawat Ahli Pertama" },
    { nama: "Yenny Paramita, S.Si.T", jabatan: 'bidan', jabatanLengkap: "Bidan Ahli Pertama" },
    { nama: "Nisak Nur Asifa, S.Tr,.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Ahli Pertama" },
    { nama: "Sutriani F, AMK", jabatan: 'perawat', jabatanLengkap: "Perawat Terampil" },
    { nama: "Wismayani Basri, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Isna, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Sitha Dwi Wulandari, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Kamaria, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Siti Nuriah, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Siti Lailiah, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Yesi Purnamasari, A,Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Selvy Anatarias S.B, A.Md.Keb", jabatan: 'bidan', jabatanLengkap: "Bidan Terampil" },
    { nama: "Dita Noviyanti", jabatan: 'administrasi', jabatanLengkap: "Pengadministrasi Perkantoran" },
    { nama: "drg. Selvi Lesmawati", jabatan: 'dokter', jabatanLengkap: "Dokter Gigi Ahli Pertama" },
]
