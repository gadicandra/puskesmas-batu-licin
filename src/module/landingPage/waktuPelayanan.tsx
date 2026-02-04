"use client"

import React, { useEffect, useState } from "react"

function pad(n: number) {
	return n < 10 ? `0${n}` : `${n}`
}

function formatTime(hours: number, minutes = 0) {
	return `${pad(hours)}:${pad(minutes)}`
}

function isOpenBySchedule(date: Date) {
	const day = date.getDay() // 0 Sun .. 6 Sat
	const minutes = date.getHours() * 60 + date.getMinutes()

	const openStart = 7 * 60 + 30 // 07:30

	if (day >= 1 && day <= 4) {
		// Monday - Thursday 07:30 - 14:00
		return minutes >= openStart && minutes < 14 * 60
	}

	if (day === 5) {
		// Friday 07:30 - 11:00
		return minutes >= openStart && minutes < 11 * 60
	}

	if (day === 6) {
		// Saturday 07:30 - 12:00
		return minutes >= openStart && minutes < 12 * 60
	}

	// Sunday closed
	return false
}

function nextOpenMessage(date: Date) {
	const day = date.getDay()
	// If today is Saturday, next open is Monday 07:30
	if (day === 6) return `Buka Senin ${formatTime(7, 30)}`
	// Otherwise open tomorrow 07:30
	return `Buka Besok ${formatTime(7, 30)}`
}

export default function WaktuPelayanan() {
	const [now, setNow] = useState(new Date())

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 30 * 1000)
		return () => clearInterval(t)
	}, [])

	const open = isOpenBySchedule(now)
	const statusMessage = open ? `Buka Sekarang` : `Tutup · ${nextOpenMessage(now)}`

	return (
		<section className="max-w-8xl mx-auto py-12">
			<div className="text-center mb-6">
				<h2 className="text-3xl md:text-4xl font-semibold text-slate-800">Waktu Pelayanan</h2>
				<p className="text-sm md:text-lg text-slate-500 mt-2">Informasi jam operasional untuk setiap jenis pelayanan di Puskesmas kami.</p>
				<div className="inline-flex items-center gap-3 mt-4 bg-white border rounded-full px-4 py-2 shadow-sm">
					<span className={`w-3 h-3 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}></span>
					<span className={`${open ? 'text-green-700' : 'text-red-600'} font-medium`}>{open ? 'Buka' : 'Tutup'}</span>
					<span className="text-slate-500">·</span>
					<span className="text-sm text-slate-600">{open ? `Sampai ${now.getDay() >= 1 && now.getDay() <= 4 ? formatTime(14) : now.getDay() === 5 ? formatTime(11) : formatTime(12)}` : nextOpenMessage(now)}</span>
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
						<li className="flex items-center justify-between"><span className="text-slate-600">Senin - Kamis</span><span className="text-green-600">07:30 - 14:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Jumat</span><span className="text-green-600">07:30 - 11:00</span></li>
						<li className="flex items-center justify-between"><span className="text-slate-600">Sabtu</span><span className="text-green-600">07:30 - 12:00</span></li>
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
						<li className="flex items-center justify-between"><span className="text-slate-600">Senin - Sabtu</span><span className="text-green-600">07:00 - 13:00</span></li>
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

