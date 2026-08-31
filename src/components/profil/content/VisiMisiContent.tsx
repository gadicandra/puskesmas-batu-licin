import React from "react";
import { CheckCircle2 } from "lucide-react";

const misiItems = [
    "Meningkatkan kualitas dan aksesibilitas pendidikan dan pelatihan untuk mewujudkan sumber daya manusia yang berkompetensi dan berkarakter dilandasi iman dan takwa.",
    "Meningkatkan kualitas sarana dan pelayanan kesehatan untuk mewujudkan masyarakat yang sehat, produktif, dan sejahtera.",
    "Mewujudkan pembangunan infrastruktur yang berkualitas dan merata untuk mempercepat konektivitas, mobilitas, dan pertumbuhan ekonomi.",
    "Mewujudkan tata kelola pemerintahan yang adaptif, melayani, dan akuntabel.",
];

const VisiMisiContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-12 lg:mt-20 mb-10">
                <div className="flex flex-col items-center">
                    <h3 className="text-3xl md:text-[40px] font-bold text-slate-800 mb-6">Visi</h3>
                    <div className="bg-white border-[5px] border-secondary rounded-2xl p-6 md:p-8 shadow-[0_12px_32px_0_rgba(0,0,0,0.04)] w-full text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-700 italic leading-relaxed">
                                &quot;BerAKSI Menuju Tanah Bumbu yang Maju, Makmur dan Beradab melalui
                                Penguatan Sumber Daya Manusia dan Tata Kelola Pemanfaatan Sumber
                                Daya Alam yang Berkelanjutan&quot;
                            </p>
                            <p className="mt-5 text-sm font-semibold text-slate-500">
                                Visi pembangunan Kabupaten Tanah Bumbu RPJMD 2025-2029
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center w-full">
                    <div className="bg-white rounded-2xl p-6 md:p-10 shadow-[0_2px_20px_0_rgba(0,0,0,0.08)] w-full border border-slate-100">
                        <h3 className="flex justify-center text-3xl md:text-[40px] font-bold text-slate-800 mb-6">Misi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {misiItems.map((item, index) => (
                                <MisiItem key={item} number={index + 1} text={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MisiItem = ({ number, text }: { number: number; text: string }) => (
    <div className="flex gap-4 items-start group hover:bg-slate-50 p-4 rounded-xl transition-colors">
        <div className="relative shrink-0">
            <CheckCircle2 className="w-7 h-7 text-secondary group-hover:scale-110 transition-transform" />
            <span className="sr-only">Misi {number}</span>
        </div>
        <p className="text-slate-600 text-base md:text-lg leading-relaxed">{text}</p>
    </div>
);

export default VisiMisiContent;
