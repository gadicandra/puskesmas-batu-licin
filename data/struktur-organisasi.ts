export type OrgPerson = {
    name: string;
    role: string;
    photo?: string;
};

export type OrgUnit = {
    title: string;
    person: string;
};

export type OrgCluster = {
    title: string;
    lead: string;
    accentClass: string;
    units: OrgUnit[];
};

export type StrukturOrganisasiData = {
    kepala: OrgPerson;
    dasarHukum: {
        text: string;
        nomor: string;
        tanggal: string;
    };
    clusters: OrgCluster[];
};

export const strukturOrganisasi: StrukturOrganisasiData = {
    kepala: {
        role: "Kepala Puskesmas",
        name: "dr. Laurensius L., MH",
    },
    dasarHukum: {
        text: "Berdasarkan SK Kepala Dinas Kesehatan Kabupaten Tanah Bumbu",
        nomor: "B/400.7.2.3/0381/DINKES-YANKES/IV/2025",
        tanggal: "28 April 2025",
    },
    clusters: [
        {
            title: "Manajemen",
            lead: "Isman S., S.Kep., Ns., M.M",
            accentClass: "border-l-secondary text-secondary bg-secondary/10",
            units: [
                { title: "Manajemen Inti", person: "Isman S., S.Kep., Ns., M.M" },
                { title: "Sarpras", person: "Syaiful Fahrin, S.Kep., Ns" },
                { title: "Mutu", person: "dr. Mardalena" },
                { title: "Jejaring", person: "dr. Andri Wijanarko" },
                { title: "Keuangan", person: "Debora Silitonga, S.Ak" },
                { title: "Sistem Info. Digital", person: "Hijratul Riskhi, A.Md.Kes" },
                { title: "Pemberdayaan Masyarakat", person: "Nani Rohayah, SKM" },
                { title: "Arsip & SDM", person: "Dita Noviyanti" },
            ],
        },
        {
            title: "Ibu & Anak",
            lead: "dr. Mardalena",
            accentClass: "border-l-emerald-600 text-emerald-700 bg-emerald-50",
            units: [
                { title: "Kesehatan Ibu", person: "Ratna Nur S., A.Md.Keb" },
                { title: "Kes. Bayi & Anak", person: "Rina Jun Fitri, A.Md.Keb" },
                { title: "Kes. Usia Sekolah", person: "Dyah K.A., S.Kep., Ns" },
                { title: "Kesehatan Remaja", person: "Fera H., S.Kep., Ns" },
                { title: "Kes. Anak Pra Sekolah", person: "Rina Jun Fitri, A.Md.Keb" },
            ],
        },
        {
            title: "Dewasa & Lansia",
            lead: "dr. Andri Wijanarko",
            accentClass: "border-l-teal-600 text-teal-700 bg-teal-50",
            units: [
                { title: "Usia Dewasa", person: "Mahpuzatul, J., S.Kep., Ns" },
                { title: "Usia Lansia", person: "Siti Aisyah, S.Kep., Ns" },
                { title: "Kes. Reproduksi", person: "Hj. Badariah, A.Md.Keb" },
            ],
        },
        {
            title: "P2M & Kesling",
            lead: "dr. Dyni Iswatinisia",
            accentClass: "border-l-sky-600 text-sky-700 bg-sky-50",
            units: [
                { title: "Surveilance", person: "Harno, SKM" },
                { title: "Promkes", person: "Indri Delliyana, SKM" },
                { title: "Kesling", person: "Mey Lida S.L., A.Md.Kes" },
            ],
        },
        {
            title: "Lintas Kluster",
            lead: "dr. Nidhya Dwie M",
            accentClass: "border-l-tertiary text-tertiary bg-tertiary/10",
            units: [
                { title: "Laboratorium", person: "Ade Susan I., A.Md.AK" },
                { title: "Farmasi", person: "Rahmayani M., S.Farm., Apt" },
                { title: "Gigi & Mulut", person: "drg. Lukman Noor Hakim" },
                { title: "UGD & Tindakan", person: "Darmiaty, S.Kep., Ns" },
                { title: "Gizi", person: "Sri Norliani, A.Md.Gz" },
                { title: "Krisis Kesehatan", person: "dr. Mardalena" },
                { title: "Rehab Medik", person: "Siti Nur Halizah, A.Md.Kes" },
            ],
        },
    ],
};
