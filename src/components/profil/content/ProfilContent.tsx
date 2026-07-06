import React from "react";
import {
    Ambulance,
    Building2,
    LandPlot,
    Mail,
    MapPin,
    Phone,
    UserRound,
    UsersRound,
} from "lucide-react";

const profileStats = [
    { label: "Luas Wilayah", value: "105,760 Km2" },
    { label: "Desa/Kelurahan", value: "9" },
    { label: "RT", value: "53" },
    { label: "Penduduk", value: "21.314" },
    { label: "Kartu Keluarga", value: "5.999" },
];

const profileDetails = [
    { label: "Kode Puskesmas", value: "P6310050201" },
    { label: "Kategori", value: "Perkotaan" },
    { label: "Jenis", value: "Puskesmas Non Perawatan" },
    { label: "Letak", value: "Ibu Kota Kab/Kota" },
    { label: "Topografi", value: "Perbatasan" },
];

const ProfilContent = () => {
    return (
        <div className="flex flex-col gap-6 lg:mt-20 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-secondary">Profil Puskesmas</p>
                        <h2 className="text-2xl font-bold leading-tight text-primary md:text-4xl">
                            UPTD Puskesmas Batulicin
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-secondary/10 px-4 py-3 text-secondary">
                        <Building2 className="h-6 w-6 shrink-0" />
                        <span className="text-sm font-bold">Puskesmas Non Perawatan</span>
                    </div>
                </div>

                <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                    UPTD Puskesmas Batulicin merupakan fasilitas pelayanan kesehatan tingkat pertama
                    di Kecamatan Batulicin, Kabupaten Tanah Bumbu. Puskesmas ini melayani wilayah
                    perkotaan yang berada di ibu kota kabupaten/kota dengan karakter wilayah perbatasan.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {profileStats.map((item) => (
                        <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                            <p className="text-xl font-bold text-primary md:text-2xl">{item.value}</p>
                            <p className="mt-1 text-xs font-medium text-slate-500 md:text-sm">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InfoCard
                    icon={<UserRound className="h-5 w-5" />}
                    title="Kepala Puskesmas"
                    value="dr. Laurensius Lungan, M.H"
                />
                <InfoCard
                    icon={<MapPin className="h-5 w-5" />}
                    title="Alamat"
                    value="Jl. Pemerintahan No.071 RT.005 RW.001, Kel. Batulicin, Kec. Batulicin, Kab. Tanah Bumbu, Kalimantan Selatan"
                />
                <InfoCard
                    icon={<Phone className="h-5 w-5" />}
                    title="Telepon / WhatsApp"
                    value="0811 4881 2882"
                />
                <InfoCard
                    icon={<Mail className="h-5 w-5" />}
                    title="Email"
                    value="puskesmasbatulicin@yahoo.com"
                />
                <InfoCard
                    icon={<Ambulance className="h-5 w-5" />}
                    title="Emergency Call PSC 119"
                    value="0852-4931-2786 (Syaiful Fahrin)"
                    highlight
                />
                <InfoCard
                    icon={<UsersRound className="h-5 w-5" />}
                    title="Wilayah Kerja"
                    value="7 desa dan 2 kelurahan dalam wilayah kerja Kecamatan Batulicin"
                />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <LandPlot className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Data Umum</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {profileDetails.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3">
                            <span className="text-sm font-medium text-slate-500">{item.label}</span>
                            <span className="text-right text-sm font-bold text-slate-800">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    title,
    value,
    highlight = false,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    highlight?: boolean;
}) => (
    <div className={`rounded-2xl border p-5 shadow-sm ${highlight ? "border-secondary/30 bg-secondary/10" : "border-slate-100 bg-white"}`}>
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${highlight ? "bg-secondary text-white" : "bg-primary/10 text-primary"}`}>
            {icon}
        </div>
        <p className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <p className="text-base font-semibold leading-relaxed text-slate-800">{value}</p>
    </div>
);

export default ProfilContent;
