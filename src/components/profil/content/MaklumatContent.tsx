import React from "react";
import Image from "next/image";
import { FileCheck2 } from "lucide-react";

const MaklumatContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center lg:mt-20">
                <Image
                    src="/logo_puskesmas.webp"
                    alt="Foto Logo Puskesmas"
                    width={1000}
                    height={1000}
                    className="w-[30%] lg:w-[10%] mb-5"
                />
                <h2 className="text-2xl md:text-3xl lg:text-[64px] font-bold text-primary text-center mb-4 lg:mb-10">UPTD Puskesmas Batulicin</h2>

                <div className="max-w-4xl flex flex-col items-center text-center relative px-4 py-4 md:px-8">
                    <Image
                        src="/vector.webp"
                        alt="Vector"
                        width={1000}
                        height={1000}
                        className="w-[80%] mb-10"
                    />

                    <div className="rounded-2xl border border-secondary/20 bg-white p-6 shadow-sm md:p-8">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-white">
                            <FileCheck2 className="h-7 w-7" />
                        </div>
                        <p className="text-xl md:text-2xl font-bold text-slate-600 leading-relaxed mb-5">
                            &quot;Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai
                            standar pelayanan yang telah ditentukan dengan penuh rasa tanggung jawab,
                            dan apabila tidak menepati janji, kami siap menerima sanksi sesuai
                            peraturan perundang-undangan yang berlaku.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaklumatContent;
