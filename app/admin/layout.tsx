import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | DOE Foundation',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#f8f5ef] text-[#1a1917]">{children}</div>
}
