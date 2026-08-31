import { getPayload } from 'payload'
import config from '@payload-config'
import { requireSuperAdmin } from '@/lib/dashboard/auth'
import PageHeader from '@/components/dashboard/ui/PageHeader'
import FormJamOperasional from '@/components/dashboard/pengaturan/FormJamOperasional'
import FormSitus from '@/components/dashboard/pengaturan/FormSitus'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pengaturan | Dashboard' }

export default async function PengaturanPage() {
    const user = await requireSuperAdmin()
    const payload = await getPayload({ config })

    const [jam, situs] = await Promise.all([
        payload.findGlobal({ slug: 'operational-hours', user, overrideAccess: false }),
        payload.findGlobal({ slug: 'site-settings', user, overrideAccess: false }),
    ])

    return (
        <>
            <PageHeader
                judul="Pengaturan"
                keterangan="Jam pelayanan dan informasi kontak yang tampil di seluruh halaman website."
            />
            <div className="flex flex-col gap-8">
                <FormJamOperasional
                    jadwalAwal={(jam.jadwal ?? []).map((b) => ({ hari: b.hari, jam: b.jam }))}
                    catatanAwal={jam.catatan ?? ''}
                />
                <FormSitus
                    awal={{
                        namaInstansi: situs.namaInstansi ?? '',
                        alamat: situs.alamat ?? '',
                        telepon: situs.telepon ?? '',
                        email: situs.email ?? '',
                        sosialMedia: (situs.sosialMedia ?? []).map((s) => ({ platform: s.platform, url: s.url })),
                    }}
                />
            </div>
        </>
    )
}
