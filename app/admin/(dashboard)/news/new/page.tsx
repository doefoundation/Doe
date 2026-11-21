import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageHeading } from '@/components/admin/admin-shell'
import { NewsForm } from '@/components/admin/news-form'

export default function NewArticlePage() {
  return (
    <>
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
        <ArrowLeft size={16} aria-hidden="true" /> All articles
      </Link>
      <PageHeading eyebrow="News" title="New article" />
      <NewsForm />
    </>
  )
}
