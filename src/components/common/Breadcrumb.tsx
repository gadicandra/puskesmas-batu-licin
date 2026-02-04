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

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <section className="bg-white w-full border-b border-gray-100">
            <Container className="py-4 md:py-4">
                <nav className="flex items-center text-sm font-medium text-slate-600">
                    <ol className="flex items-center space-x-2">
                        {items.map((item, index) => {
                            const isLast = index === items.length - 1;

                            return (
                                <li key={index} className="flex items-center">
                                    {index > 0 && (
                                        <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                                    )}
                                    <Link
                                        href={item.href}
                                        className={`hover:text-primary transition-colors border-b border-transparent hover:border-primary ${isLast ? "text-slate-900 font-semibold border-slate-900" : "border-slate-400"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
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
