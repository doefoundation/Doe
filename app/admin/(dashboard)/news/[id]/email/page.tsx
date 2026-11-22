import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { PageHeading } from '@/components/admin/admin-shell'
import { EmailSender } from '@/components/admin/email-sender'
import { getBrevoConfig, getSubscriberCount } from '@/lib/brevo'
import { formatDate } from '@/lib/cms-types'
import { buildArticleEmail } from '@/lib/email-template'
import { getSiteUrl } from '@/lib/site'

export const metadata = { title: 'Email subscribers | DOE Foundation Admin' }

export default async function EmailArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const { supabase, user } = await requireAdmin()
  const { data: post } = await supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, content, category, cover_image_url, status, published_at, emailed_at')
    .eq('id', id)
    .maybeSingle()
  if (!post) notFound()

  const live = post.status === 'published' && post.published_at && new Date(post.published_at).getTime() <= Date.now()
  const config = getBrevoConfig()

  const back = (
    <Link href="/admin/news" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
      <ArrowLeft size={16} aria-hidden="true" /> All articles
    </Link>
  )

  if (!live) {
    return (
      <>
        {back}
        <PageHeading eyebrow="News" title="Email subscribers" />
        <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Only articles that are live on the website can be emailed, because the email links to the article page. Publish this article first, then come back.
        </p>
      </>
    )
  }

  if (!config.ready) {
    return (
      <>
        {back}
        <PageHeading eyebrow="News" title="Email subscribers" />
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          Email sending is not set up. Check that BREVO_API_KEY and BREVO_LIST_ID are saved in Vercel, then redeploy.
        </p>
      </>
    )
  }

  const siteUrl = getSiteUrl()
  const email = buildArticleEmail(
    {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImageUrl: post.cover_image_url,
      publishedAt: post.published_at,
      url: `${siteUrl}/news/${post.slug}`,
    },
    { siteUrl, unsubscribeUrl: '#', mirrorUrl: '#' },
  )

  const subscribers = await getSubscriberCount(config.listId)

  return (
    <>
      {back}
      <PageHeading eyebrow="News" title="Email subscribers" description="Check the preview, send yourself a test, then send it to everyone on the list." />
      <EmailSender
        articleId={post.id}
        subject={email.subject}
        previewText={email.previewText}
        previewHtml={email.html}
        senderLabel={`${config.senderName} <${config.senderEmail}>`}
        subscriberCount={subscribers.ok ? subscribers.data : null}
        subscriberError={subscribers.ok ? null : subscribers.message}
        defaultEmail={user.email ?? ''}
        emailedLabel={post.emailed_at ? formatDate(post.emailed_at) : null}
      />
    </>
  )
  }
