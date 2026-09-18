import Container from "@/components/layout/Container/Container";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Jejak halaman, mis. Beranda › Profil › Posyandu & lokasi.
 *
 * - Item terakhir adalah halaman yang sedang dibuka, jadi dirender sebagai teks
 *   dengan `aria-current="page"`, bukan link ke dirinya sendiri.
 * - Setiap link punya area tap minimal 44px (`min-h-11`) supaya mudah ditekan
 *   di ponsel. Tinggi teksnya sendiri hanya ±21px.
 * - Daftar boleh membungkus ke baris berikut, jadi judul yang panjang (mis.
 *   judul artikel) tidak membuat halaman menggulir ke samping di layar sempit.
 *
 * Padding vertikal bawaan `Container` di mobile (`py-10`) dimatikan. Tanpa itu
 * pita breadcrumb setinggi 134px di ponsel, dan area tap 44px akan membuatnya
 * makin tinggi. Di desktop tingginya tetap 52–54px seperti sebelumnya.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <section className="bg-latar w-full border-b border-gray-100">
            <Container className="py-0 md:py-0" sectionClassName="py-1.5 md:py-1">
                <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-600">
                    <ol className="flex flex-wrap items-center">
                        {items.map((item, index) => {
                            const isLast = index === items.length - 1;

                            return (
                                <li key={index} className="flex min-w-0 items-center">
                                    {index > 0 && (
                                        <ChevronRight aria-hidden="true" className="mx-2 h-4 w-4 shrink-0 text-slate-400" />
                                    )}
                                    {isLast ? (
                                        <span
                                            aria-current="page"
                                            className="inline-flex min-h-11 items-center font-semibold text-slate-900"
                                        >
                                            {item.label}
                                        </span>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="group inline-flex min-h-11 items-center transition-colors hover:text-primary"
                                        >
                                            <span className="border-b border-transparent group-hover:border-primary">
                                                {item.label}
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </Container>
        </section>
    );
};

export default Breadcrumb;
