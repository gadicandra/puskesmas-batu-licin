export type PengaduanTab = "alur" | "pengaduan" | "kritik";

export interface AlurPengaduanStep {
  id?: string | number;
  order: number;
  title: string;
  description: string;
  details?: string[];
}

export interface PengaduanFormValues {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

export type PengaduanFormErrors = Partial<Record<keyof PengaduanFormValues, string>>;
