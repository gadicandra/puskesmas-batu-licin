import type { Payload } from 'payload'

interface DefaultAlurStep {
  order: number
  title: string
  description: string
  details?: Array<{ text: string }>
}

const defaultSteps: DefaultAlurStep[] = [
  {
    order: 1,
    title: 'Masuk Halaman Pengaduan',
    description: 'Pastikan Anda sudah berada di halaman Pengaduan.',
  },
  {
    order: 2,
    title: 'Pilih Form Pengaduan atau Kritik & Saran',
    description: 'Pilih jenis pesan yang ingin Anda kirimkan.',
    details: [
      { text: 'Gunakan Form Pengaduan untuk mengirim pesan pengaduan.' },
      { text: 'Gunakan Kritik & Saran untuk menyampaikan masukan.' },
    ],
  },
  {
    order: 3,
    title: 'Masukkan Nama, Email, Subject, dan Pesan',
    description:
      'Isi nama, email atau nomor telepon, subject pesan, dan pesan yang ingin Anda sampaikan.',
  },
  {
    order: 4,
    title: 'Kirim Pesan Anda',
    description: 'Tekan tombol "Send Message" untuk mengirim pesan Anda.',
  },
  {
    order: 5,
    title: 'Pesan Terkirim',
    description:
      'Pesan Anda berhasil terkirim. Terima kasih telah mengirim pesan kepada kami.',
  },
]

export async function seedAlurPengaduan(payload: Payload) {
  const existingSteps = await payload.find({
    collection: 'alur-pengaduan-steps',
    limit: 1,
    overrideAccess: true,
  })

  if (existingSteps.totalDocs > 0) {
    return
  }

  for (const step of defaultSteps) {
    await payload.create({
      collection: 'alur-pengaduan-steps',
      data: {
        ...step,
        active: true,
      },
      overrideAccess: true,
    })
  }

  payload.logger.info('Seeded 5 default alur pengaduan steps')
}
