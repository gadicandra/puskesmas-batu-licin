"use client"

import React, { useRef } from "react"
import Link from "next/link"
import { ChevronRight, ChevronDown } from "lucide-react"

type LayananItem = {
	title: string
	subtitle?: string
	image?: string
	href?: string
}

type Props = {
	items?: LayananItem[]
	moreHref?: string
}

const DEFAULT_ITEMS: LayananItem[] = [
	{
		title: "Imunisasi",
		subtitle: "Program vaksinasi untuk bayi, anak, dan dewasa",
		image: "/imunisasi_2x.webp",
		href: "/layanan/imunisasi"
	},
	{
		title: "Poli Gigi",
		subtitle: "Program pelayanan untuk bayi, anak, dan dewasa",
		image: "/poligigi_2x.webp",
		href: "/layanan/poligigi"
	},
	{
		title: "Poli Umum",
		subtitle: "Program vaksinasi untuk bayi, anak, dan dewasa",
		image: "/poliumum_2x.webp",
		href: "/layanan/poliumum"
	},
	{
		title: "Poli Anak",
		subtitle: "Program vaksinasi untuk bayi, anak, dan dewasa",
		image: "/polianak_2x.webp",
		href: "/layanan/polianak"
	},
	{
		title: "Laboratorium",
		subtitle: "Program pelayanan untuk bayi, anak, dan dewasa",
		image: "/laboratorium_2x.webp",
		href: "/layanan/laboratorium"
	},
]

export default function Layanan({ items = DEFAULT_ITEMS, moreHref = "/layanan" }: Props) {
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollNext = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
		}
	}

	return (
		<section className="w-full py-8 md:py-12 bg-white">
			<div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
				<div className="text-center">
					<h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-2">
						Layanan Kesehatan
					</h2>
					<p className="text-sm md:text-lg md:text-slate-500 text-slate-600 max-w-2xl mx-auto">
						Puskesmas Batulicin menyediakan berbagai layanan kesehatan untuk memenuhi kebutuhan masyarakat dengan tenaga kesehatan yang profesional
					</p>
				</div>
			</div>

			{/* Mobile View: 2 cards per row, 2 rows with blur on second row */}
			<div className="md:hidden relative">
				<div className="grid grid-cols-2 gap-3 px-4">
					{/* First row - fully visible */}
					{items.slice(0, 2).map((item, idx) => (
						<Link
							key={idx}
							href={item.href || moreHref}
							className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="relative h-32 bg-gray-200">
								<img
									src={item.image}
									alt={item.title}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
								<div className="absolute bottom-0 left-0 right-0 p-3">
									<h3 className="text-white font-semibold text-sm leading-tight">
										{item.title}
									</h3>
									<p className="text-white/90 text-xs mt-1 line-clamp-2">
										{item.subtitle}
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>

				{/* Second row - with gradient blur overlay */}
				{/* Second row - with gradient blur overlay */}
				<div className="relative mt-3 px-4">
					<div className="grid grid-cols-2 gap-3">
						{items.slice(2, 4).map((item, idx) => (
							<Link
								key={idx}
								href={item.href || moreHref}
								className="block rounded-lg overflow-hidden shadow-sm"
							>
								<div className="relative h-32 bg-gray-200">
									<img
										src={item.image}
										alt={item.title}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-3">
										<h3 className="text-white font-semibold text-sm leading-tight">
											{item.title}
										</h3>
										<p className="text-white/90 text-xs mt-1 line-clamp-2">
											{item.subtitle}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>

					{/* Gradient blur overlay - clear at top, blurred at bottom */}
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 100%)',
						}}
					/>

					{/* Alternative: Using mask-image for more precise control */}
					<div
						className="absolute inset-0 bg-white/60 backdrop-blur-sm pointer-events-none"
						style={{
							maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 100%)',
							WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 100%)',
						}}
					/>

					{/* Selengkapnya button - positioned over the images */}
					<div className="absolute bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
						<Link
							href={moreHref}
							className="inline-flex text-md items-center gap-2 text-secondary font-semibold text-sm hover:text-secondary transition-colors pointer-events-auto"
						>
							Selengkapnya
							<ChevronDown className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>

			{/* Desktop View: Full width horizontal scroll with blur on rightmost card */}
			<div className="hidden md:block">
				<div className="relative">
					{/* Scroll container */}
					<div
						ref={scrollContainerRef}
						className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth "
						style={{
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
						}}
					>
						{items.map((item, idx) => {
							const isLast = idx === items.length - 1

							return (
								<Link
									key={idx}
									href={item.href || moreHref}
									className={`flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group ${isLast ? 'relative' : ''
										}`}
									style={{ width: 'calc((100vw - 8rem) / 4.5)' }}
								>
									<div className="relative h-70 bg-gray-200">
										<img
											src={item.image}
											alt={item.title}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

										{/* Blur overlay on last card */}
										{isLast && (
											<div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
										)}

										<div className="absolute bottom-0 left-0 right-0 p-5">
											<h3 className="text-white font-bold text-lg mb-2 leading-tight">
												{item.title}
											</h3>
											<p className="text-white/95 text-sm leading-relaxed">
												{item.subtitle}
											</p>
										</div>
									</div>
								</Link>
							)
						})}
					</div>

					{/* Arrow button on the right - positioned to overlap last card */}
					<button
						onClick={scrollNext}
						className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center bg-secondary hover:bg-secondary text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
						aria-label="Lihat lebih banyak layanan"
					>
						<ChevronRight className="w-6 h-6" />
					</button>
				</div>
			</div>

			<style jsx>{`
				.scrollbar-hide::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</section>
	)
}