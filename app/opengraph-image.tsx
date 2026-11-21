import { ImageResponse } from 'next/og'

export const alt = 'DOE Foundation — Education for every future'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#f8f5ef',
          padding: 72,
          color: '#1a1917',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: '#d70063', fontSize: 26, letterSpacing: 5, textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', width: 56, height: 4, background: '#d70063', marginRight: 20 }} />
          Davida Omosomi Empowerment Foundation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, lineHeight: 1, letterSpacing: -4 }}>Education for</div>
          <div style={{ display: 'flex', fontSize: 120, lineHeight: 1.05, letterSpacing: -4, color: '#d70063' }}>every future.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#6b6a66' }}>Quality education, mentorship, and opportunity for young people.</div>
      </div>
    ),
    { ...size },
  )
}
