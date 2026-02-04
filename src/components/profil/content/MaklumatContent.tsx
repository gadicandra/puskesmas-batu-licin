import React from "react";
import Image from "next/image";

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

                <div className="max-w-4xl flex flex-col items-center text-center relative px-8 py-4">
                    {/* Decorative quote marks/lines could go here */}
                    <Image
                        src="/vector.webp"
                        alt="Vector"
                        width={1000}
                        height={1000}
                        className="w-[80%] mb-10"
                    />

                    <p className="text-xl md:text-2xl font-bold text-slate-600 leading-relaxed mb-5">
                        "Dengan ini, kami menyatakan sanggup menyelenggarakan pelayanan
                        sesuai standar pelayanan yang telah ditetapkan. Apabila kami tidak
                        menepati janji ini, kami siap menerima sanksi sesuai peraturan
                        perundang-undangan yang berlaku."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MaklumatContent;
