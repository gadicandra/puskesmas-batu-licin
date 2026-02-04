import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const VisiMisiContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-12 lg:mt-20 mb-10">
                {/* Visi */}
                <div className="flex flex-col items-center">
                    <h3 className="text-[40px] font-bold text-slate-800 mb-6">Visi</h3>
                    <div className="bg-white border-[5px] border-secondary rounded-2xl p-8 shadow-[0_12px_32px_0_rgba(0,0,0,0.04)] w-full text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-2xl md:text-3xl font-medium text-slate-700 italic">
                                "Terwujudnya Masyarakat yang Sehat, Mandiri, dan Berkeadilan."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Misi */}
                <div className="flex flex-col items-center w-full">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 md:pt-6 shadow-[0_2px_20px_0_rgba(0,0,0,0.08)] w-full border border-slate-100">
                        <h3 className="flex justify-center text-[40px] font-bold text-slate-800 mb-6">Misi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <MisiItem text="Menyelenggarakan pelayanan kesehatan tingkat pertama yang bermutu dan merata." />
                            <MisiItem text="Meningkatkan pencegahan dan pengendalian penyakit serta penyehatan lingkungan." />
                            <MisiItem text="Mendorong kemandirian hidup sehat bagi keluarga dan masyarakat." />
                            <MisiItem text="Menggerakkan pembangunan berwawasan kesehatan di wilayah kerja." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MisiItem = ({ text }: { text: string }) => (
    <div className="flex gap-4 items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
        <CheckCircle2 className="w-6 h-6 text-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
        <p className="text-slate-600 text-lg leading-relaxed">{text}</p>
    </div>
);

export default VisiMisiContent;
