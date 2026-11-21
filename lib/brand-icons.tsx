import { ImageResponse } from 'next/og'

const LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_00000000ebbc8243b1a46e16cc7df432-Ey2WCQZAaBoXSQKqIEQgRVc2ePrSvh.png'

async function loadLogo() {
  try {
    const response = await fetch(LOGO_URL)
    if (!response.ok) return null
    const type = response.headers.get('content-type') || 'image/png'
    const data = Buffer.from(await response.arrayBuffer()).toString('base64')
    return `data:${type};base64,${data}`
  } catch {
    return null
  }
}

export async function renderBrandIcon(side: number, radius: number) {
  const logo = await loadLogo()
  const inner = Math.round(side * 0.86)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          borderRadius: radius,
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={inner} height={inner} style={{ objectFit: 'contain' }} />
        ) : (
          <div style={{ display: 'flex', fontSize: Math.round(side * 0.42), fontWeight: 700, color: '#d70063' }}>DOE</div>
        )}
      </div>
    ),
    { width: side, height: side },
  )
}
