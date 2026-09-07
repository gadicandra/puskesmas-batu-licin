import React from 'react'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import { ambilJamPelayanan } from '@/lib/konten/jam-pelayanan'
import PageViewTracker from '@/components/analytics/PageViewTracker'

export const metadata = {
  description: 'Website Puskesmas Batu Licin - Melayani Kesehatan Masyarakat',
  title: 'Puskesmas Batu Licin',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props
  // Diambil di layout (server component) lalu dioper ke Footer yang berupa
  // komponen klien. Ini pola bakunya: yang menyentuh database selalu server
  // component; komponen klien menerima data lewat props.
  const jamPelayanan = await ambilJamPelayanan()

  return (
    <div className="min-h-screen bg-white">
      <PageViewTracker />
      <Navbar />
      <main>{children}</main>
      <Footer jamPelayanan={jamPelayanan} />
    </div>
  )
}

