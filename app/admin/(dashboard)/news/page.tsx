import Link from 'next/link'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { deleteNews } from '@/app/admin/actions'
import { PageHeading } from '@/components/admin/admin-shell'
import { ConfirmSubmit } from '@/components/admin/form-ui'
import { StatusBadge } from '@/components/admin/status-badge'
import { formatDate } from '@/lib/cms-types'

type Props = { searchParams: Promise<{ saved?: string; deleted?: string }> }

export default async function AdminNewsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()
  const params = await searchParams
  const { data: posts } = await supabase
    .from('news_posts')
    .select('id, title, slug, category, status, published_at, updated_at')
    .order('updated_at', { ascending: false })

  const notice = params.deleted ? 'Article deleted.' : params.saved === 'published' ? 'Article published to the website.' : params.saved ? 'Draft saved.' : null

  return (
    <>
      <PageHeading
        eyebrow="Content"
        title="News"
        description="Write and publish stories that appear on the homepage and the News page."
        action={
          <Link href="/admin/news/new" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#d70063] px-5 text-sm font-semibold text-white hover:bg-[#b80055]">
            <Plus size={16} aria-hidden="true" /> New article
          </Link>
        }
      />

      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      {posts?.length ? (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-col gap-4 rounded-2xl border border-[#1a1917]/10 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={post.status} />
                  <span className="text-xs text-[#1a1917]/50">{post.category}</span>
                </div>
                <Link href={`/admin/news/${post.id}`} className="mt-2 block font-serif text-xl leading-snug tracking-[-0.02em] hover:text-[#d70063]">{post.title}</Link>
                <p className="mt-1 text-xs text-[#1a1917]/50">
                  {post.status === 'published' ? `Published ${formatDate(post.published_at)}` : `Last edited ${formatDate(post.updated_at)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {post.status === 'published' && (
                  <Link href={`/news/${post.slug}`} target="_blank" aria-label={`View ${post.title} on website`} className="flex size-11 items-center justify-center rounded-full border border-[#1a1917]/15 hover:border-[#d70063] hover:text-[#d70063]">
                    <ExternalLink size={16} aria-hidden="true" />
                  </Link>
                )}
                <Link href={`/admin/news/${post.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#1a1917]/15 px-4 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">
                  <Pencil size={16} aria-hidden="true" /> Edit
                </Link>
                <form action={deleteNews}>
                  <input type="hidden" name="id" value={post.id} />
                  <ConfirmSubmit
                    message={`Delete "${post.title}"? This cannot be undone.`}
                    ariaLabel={`Delete ${post.title}`}
                    className="flex size-11 items-center justify-center rounded-full border border-[#1a1917]/15 text-red-700 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#1a1917]/20 bg-white px-6 py-16 text-center">
          <p className="font-serif text-2xl">No articles yet</p>
          <p className="mt-2 text-sm text-[#1a1917]/60">Published articles appear on the homepage and at /news.</p>
          <Link href="/admin/news/new" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d70063] px-5 text-sm font-semibold text-white hover:bg-[#b80055]">
            <Plus size={16} aria-hidden="true" /> Write your first article
          </Link>
        </div>
      )}
    </>
  )
}
