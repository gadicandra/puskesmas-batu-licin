"use client";

import FormPengaduanPanel from "./FormPengaduanPanel";

export default function KritikSaranPanel() {
  return (
    <FormPengaduanPanel
      variant="light"
      endpoint="/api/kritik-saran"
      idPrefix="kritik-saran"
      successTitle="Kritik dan saran terkirim"
      successDescription="Terima kasih atas masukan Anda. Tim Puskesmas Batulicin akan meninjau pesan ini untuk meningkatkan layanan."
    />
  );
}
