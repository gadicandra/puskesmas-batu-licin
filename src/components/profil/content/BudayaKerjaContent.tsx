import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const BudayaKerjaContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center lg:mt-20">
                <div className="bg-white rounded-[2.5rem] p-4 shadow-sm w-full border-2 border-secondary/20">
                    <div className="bg-slate-50 rounded-[2rem] w-full aspect-[18/9] relative overflow-hidden flex items-center justify-center border border-slate-100">
                        <Image
                            src="/batulicin.webp"
                            alt="Foto Satu Puskesmas"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm w-full border border-slate-100 md:mt-4 lg:mt-6 mb-10">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800">Budaya Kerja</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <BudayaItem text="Menyelenggarakan pelayanan kesehatan tingkat pertama yang bermutu dan merata." />
                    <BudayaItem text="Meningkatkan pencegahan dan pengendalian penyakit serta penyehatan lingkungan." />
                    <BudayaItem text="Mendorong kemandirian hidup sehat bagi keluarga dan masyarakat." />
                    <BudayaItem text="Menggerakkan pembangunan berwawasan kesehatan di wilayah kerja." />
                </div>
            </div>
        </div>
    );
};

const BudayaItem = ({ text }: { text: string }) => (
    <div className="flex gap-4 items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
        <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5" />
        <p className="text-slate-600 text-lg leading-relaxed">{text}</p>
    </div>
);

export default BudayaKerjaContent;
