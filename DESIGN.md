---
name: Puskesmas Batulicin
description: Identitas hijau untuk informasi layanan publik yang jelas dan mudah dibaca.
colors:
  primary: "#233115"
  secondary: "#697644"
  latar: "#EFF1EB"
  on-olive: "#f8faf5"
typography:
  body:
    fontFamily: "Avenir, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
rounded:
  image: "8px"
  card: "16px"
  summary: "24px"
spacing:
  small: "16px"
  medium: "24px"
  large: "32px"
---

# Design System: Puskesmas Batulicin

## Overview

Mempertahankan identitas website dan referensi Figma yang ditentukan pengguna. Halaman dokumen melayani pembaca yang ingin mengetahui capaian dan membuka bukti penghargaan. Arah halaman: Read, DESIGN_VARIANCE 3, MOTION_INTENSITY 2, VISUAL_DENSITY 5.

## Colors

Primary untuk teks utama dan penekanan akreditasi; secondary untuk kartu penghargaan; latar untuk bidang halaman. Teks on-olive memenuhi kontras 4,67:1 pada secondary. Token global tetap bersumber dari `src/app/globals.css`; on-olive berlaku pada kartu halaman sertifikat.

## Typography

Avenir lokal memakai `@font-face` dan `font-display: swap`. Judul bagian 24–30px, judul dokumen 24–30px, isi 16px dengan panjang baca maksimal 65ch. Hero memakai ukuran responsif 32–72px. Font mengikuti proyek, tanpa penambahan keluarga baru.

## Layout

Gunakan Container proyek. Halaman sertifikat membatasi isi ke 1152px. Kartu dokumen dua kolom mulai 768px, satu kolom di bawahnya; gambar tetap utuh dengan `object-contain`. Ringkasan mengikuti susunan kipas Figma pada desktop dan susunan vertikal pada mobile. Navigasi kategori berupa tautan anchor ke dua bagian yang selalu tersedia.

## Elevation & Depth

Halaman sertifikat menggunakan bidang warna dan rotasi kartu ringkasan untuk hierarki. Tidak menambah shadow atau animasi otomatis. Navbar tetap mengikuti perilaku incumbent.

## Shapes

Sudut gambar 8px, kartu dan panel 16px, ringkasan 24px. Rotasi ringkasan hanya pada desktop.

## Components

- Reuse PageHeader, Breadcrumb, Container; penyesuaian hero dibatasi CSS module halaman.
- DaftarDokumen merender nama, penerbit, tahun/tanggal, predikat, kategori, gambar, dan tautan asli.
- Ikon react-icons sesuai keluarga pada Figma: trophy, medal, calendar, star, file, external link.
- Tautan dokumen minimum tinggi 48px, underline, fokus 3px, dan label tab baru untuk pembaca layar.
- Empty state akreditasi menjelaskan ketidaktersediaan dokumen tanpa menyimpulkan status lembaga.

## Do's and Don'ts

- Gunakan dokumen sebagai sumber metadata; timestamp foto bukan tanggal penerbitan.
- Hitung ringkasan dari data yang ditampilkan.
- Pertahankan route dan navigasi proyek.
- Jangan menyalin skor, masa berlaku, atau status contoh Figma sebagai fakta.
- Jangan menggolongkan piagam lomba mutu sebagai sertifikat penetapan akreditasi.

## Last updated

2026-09-16: implementasi halaman akreditasi dan penghargaan dari Figma dengan sembilan dokumen lokal.
