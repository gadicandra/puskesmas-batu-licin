import React from 'react'
import Navbar from '@/components/layout/Navbar/Navbar'
import Footer from '@/components/layout/Footer/Footer'
import PageViewTracker from '@/components/analytics/PageViewTracker'

export const metadata = {
  description: 'Website Puskesmas Batu Licin - Melayani Kesehatan Masyarakat',
  title: 'Puskesmas Batu Licin',
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div className="min-h-screen bg-white">
      <PageViewTracker />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

