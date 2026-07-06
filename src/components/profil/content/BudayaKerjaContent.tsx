import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const budayaKerja = [
    {
        title: "5S",
        items: ["Senyum", "Sapa", "Salam", "Sopan", "Santun"],
    },
    {
        title: "5R",
        items: ["Ringkas", "Rapih", "Resik", "Rawat", "Rajin"],
    },
];

const BudayaKerjaContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center lg:mt-20">
                <div className="bg-white rounded-2xl p-4 shadow-sm w-full border-2 border-secondary/20">
                    <div className="bg-slate-50 rounded-xl w-full aspect-[18/9] relative overflow-hidden flex items-center justify-center border border-slate-100">
                        <Image
                            src="/batulicin.webp"
                            alt="UPTD Puskesmas Batulicin"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm w-full border border-slate-100 md:mt-4 lg:mt-6 mb-10">
                <div className="text-center mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800">Budaya Kerja</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budayaKerja.map((group) => (
                        <div key={group.title} className="rounded-xl bg-slate-50 p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-xl font-bold text-white">
                                    {group.title}
                                </span>
                                <p className="font-bold text-slate-800">
                                    {group.title === "5S" ? "Pelayanan kepada masyarakat" : "Kedisiplinan lingkungan kerja"}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {group.items.map((item) => (
                                    <BudayaItem key={item} text={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BudayaItem = ({ text }: { text: string }) => (
    <div className="flex gap-3 items-center rounded-lg bg-white p-3">
        <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
        <p className="text-slate-700 text-base font-semibold leading-relaxed">{text}</p>
    </div>
);

export default BudayaKerjaContent;
