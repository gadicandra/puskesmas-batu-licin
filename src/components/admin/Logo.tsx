/* Logo di layar login admin. */
export default function Logo() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo_puskesmas.webp" alt="Puskesmas Batulicin" style={{ height: 52, width: 'auto' }} />
            <span style={{ fontWeight: 900, color: '#233115', fontSize: 22, lineHeight: 1.1 }}>
                UPTD Puskesmas
                <br />
                Batulicin
            </span>
        </div>
    )
}
