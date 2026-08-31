"use client"

import React, { useEffect, useState } from "react"

function pad(n: number) {
	return n < 10 ? `0${n}` : `${n}`
}

function formatTime(hours: number, minutes = 0) {
	return `${pad(hours)}:${pad(minutes)}`
}

/** Jadwal pelayanan dalam gedung sesuai SK Kepala Puskesmas Batulicin
 *  No. B/445.61/003/PKM.Btl-Adm/I/2023. Kunci = hari (0 Minggu .. 6 Sabtu). */
const JADWAL: Record<number, { mulai: number; selesai: number } | null> = {
	0: null, // Minggu: pelayanan dalam gedung tutup (UGD tetap 24 jam)
	1: { mulai: 8 * 60, selesai: 11 * 60 }, // Senin
	2: { mulai: 8 * 60, selesai: 11 * 60 }, // Selasa
	3: { mulai: 8 * 60, selesai: 11 * 60 }, // Rabu
	4: { mulai: 8 * 60, selesai: 11 * 60 }, // Kamis
	5: { mulai: 7 * 60 + 30, selesai: 10 * 60 + 30 }, // Jumat
	6: { mulai: 8 * 60, selesai: 11 * 60 }, // Sabtu
}

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

function menitKeJam(menit: number) {
	return formatTime(Math.floor(menit / 60), menit % 60)
}

function isOpenBySchedule(date: Date) {
	const jadwal = JADWAL[date.getDay()]
	if (!jadwal) return false
	const menit = date.getHours() * 60 + date.getMinutes()
	return menit >= jadwal.mulai && menit < jadwal.selesai
}

/** Jam tutup hari ini, untuk teks "Sampai ...". */
function jamTutupHariIni(date: Date) {
	const jadwal = JADWAL[date.getDay()]
	return jadwal ? menitKeJam(jadwal.selesai) : null
}

function nextOpenMessage(date: Date) {
	for (let i = 1; i <= 7; i++) {
		const hari = (date.getDay() + i) % 7
		const jadwal = JADWAL[hari]
		if (!jadwal) continue
		const label = i === 1 ? 'Besok' : NAMA_HARI[hari]
		return `Buka ${label} ${menitKeJam(jadwal.mulai)}`
	}
	return 'Jadwal belum tersedia'
}

export default function WaktuPelayanan() {
	const [now, setNow] = useState(new Date())

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 30 * 1000)
		return () => clearInterval(t)
	}, [])

	const open = isOpenBySchedule(now)

	return (
		<section className="max-w-8xl mx-auto py-12">
			<div className="text-center mb-6">
				<h2 className="text-3xl md:text-4xl font-semibold text-slate-800">Waktu Pelayanan</h2>
				<p className="text-sm md:text-lg text-slate-500 mt-2">Informasi jam operasional untuk setiap jenis pelayanan di Puskesmas kami.</p>
				<div className="inline-flex items-center gap-3 mt-4 bg-white border rounded-full px-4 py-2 shadow-sm">
					<span className={`w-3 h-3 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}></span>
					<span className={`${open ? 'text-green-700' : 'text-red-600'} font-medium`}>{open ? 'Buka' : 'Tutup'}</span>
					<span className="text-slate-500">·</span>
					<span className="text-sm text-slate-600">{open ? `Sampai ${jamTutupHariIni(now)}` : nextOpenMessage(now)}</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
				<article
					className="border md:border-slate-200 hover:border-slate-600 transition-colors rounded-3xl p-4 bg-white"
					style={{
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
					}}
				>
					<div className="flex items-start justify-between mb-3">
						<div>
							<h3 className="font-semibold text-slate-800 lg:text-2xl">Rawat Jalan</h3>
							<p className="text-xs text-slate-500">Poli Umum, Gigi, KIA, dll</p>
						</div>
						<span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Terjadwal</span>
					</div>

					<ul className="space-y-2 text-sm">
						<li className="flex items-center justify-between"><span className="text-slate-600">Senin - Kamis</span><span className="text-green-600">08:00 - 11:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Jumat</span><span className="text-green-600">07:30 - 10:30</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Sabtu</span><span className="text-green-600">08:00 - 11:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Minggu</span><span className="text-red-500">Tutup</span></li>
					</ul>
				</article>

				<article
					className="border md:border-slate-200 hover:border-slate-600 transition-colors rounded-3xl p-4 bg-white"
					style={{
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
					}}
				>
					<div className="flex items-start justify-between mb-3">
						<div>
							<h3 className="font-semibold text-slate-800 lg:text-2xl">Laboratorium</h3>
							<p className="text-xs text-slate-500">Pemeriksaan Lab</p>
						</div>
						<span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Terjadwal</span>
					</div>
					<ul className="space-y-2 text-sm">
						<li className="flex items-center justify-between"><span className="text-slate-600">Senin - Kamis</span><span className="text-green-600">08:00 - 11:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Jumat</span><span className="text-green-600">07:30 - 10:30</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Sabtu</span><span className="text-green-600">08:00 - 11:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Minggu</span><span className="text-red-500">Tutup</span></li>
					</ul>
				</article>

				<article
					className="border md:border-slate-200 hover:border-slate-600 transition-colors rounded-3xl p-4 bg-white"
					style={{
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
					}}
				>
					<div className="flex items-start justify-between mb-3">
						<div>
							<h3 className="font-semibold text-slate-800 lg:text-2xl">UGD (Gawat Darurat)</h3>
							<p className="text-xs text-slate-500">Pelayanan Darurat 24 Jam</p>
						</div>
						<span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">24 Jam</span>
					</div>
					<div className="text-sm text-slate-600">Setiap Hari</div>
				</article>

				<article
					className="border md:border-slate-200 hover:border-slate-600 transition-colors rounded-3xl p-4 bg-white"
					style={{
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
					}}
				>
					<div className="flex items-start justify-between mb-3">
						<div>
							<h3 className="font-semibold text-slate-800 lg:text-2xl">PONED</h3>
							<p className="text-xs text-slate-500">Persalinan Normal & Darurat</p>
						</div>
						<span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">24 Jam</span>
					</div>
					<div className="text-sm text-slate-600">Setiap Hari</div>
				</article>
			</div>
		</section>
	)
}

