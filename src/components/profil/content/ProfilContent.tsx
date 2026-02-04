import React from "react";
import Image from "next/image";

const ProfilContent = () => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col lg:flex-row gap-10 items-start lg:mt-20">
                <div className="w-full flex flex-col gap-2 lg:gap-6 text-lg text-slate-700 leading-relaxed">
                    <p className="text-[16px] md:text-[25px] lg:text-[30px] font-regular text-slate-800 mb-6">
                        Selamat datang di Puskesmas Batulicin. Sebagai garda terdepan pelayanan kesehatan di wilayah kami,
                        Puskesmas Batulicin berkomitmen untuk menghadirkan layanan kesehatan yang inklusif, terjangkau,
                        dan berkualitas bagi seluruh lapisan masyarakat.
                    </p>
                    <p className="text-[20px] md:text-[25px] lg:text-[30px] font-regular text-slate-800 mb-6">
                        Berdiri di tengah-tengah masyarakat, kami tidak hanya berfungsi sebagai tempat berobat,
                        tetapi sebagai mitra kesehatan keluarga Anda. Dengan dukungan tenaga medis yang kompeten
                        dan fasilitas yang memadai, kami siap mengawal kesehatan masyarakat menuju kehidupan yang lebih sejahtera.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilContent;
