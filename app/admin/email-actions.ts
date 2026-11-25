'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin-auth'
import { logActivity } from '@/lib/activity-log'
import { createCampaign, getBrevoConfig, getCampaign, getSubscriberCount, sendNow, sendTest } from '@/lib/brevo'
import { BREVO_MIRROR, BREVO_UNSUBSCRIBE, buildArticleEmail } from '@/lib/email-template'
import { getSiteUrl } from '@/lib/site'

export type EmailActionResult = { ok: true; campaignId: number; message: string } | { ok: false; error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NOT_SET_UP = 'Email sending is not set up yet. Check the Brevo variables in Vercel.'

type Supabase = Awaited<ReturnType<typeof requireAdmin>>['supabase']

/** Brevo's free plan does not allow campaign tags, so the article is recognised by a short code at the end of the campaign name. */
const campaignMarker = (articleId: string) => articleId.slice(0, 8)

async function loadLiveArticle(supabase: Supabase, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: 'Article not found.' as const }
  const { data: post } = await supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, content, category, cover_image_url, status, published_at, emailed_at')
    .eq('id', id)
    .maybeSingle()
  if (!post) return { error: 'Article not found.' as const }
  const live = post.status === 'published' && post.published_at && new Date(post.published_at).getTime() <= Date.now()
  if (!live) return { error: 'Only articles that are live on the website can be emailed.' as const }
  return { post }
}

function buildEmail(post: { title: string; slug: string; excerpt: string; content: string; category: string; cover_image_url: string | null; published_at: string | null }) {
  const siteUrl = getSiteUrl()
  return buildArticleEmail(
    {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImageUrl: post.cover_image_url,
      publishedAt: post.published_at,
      url: `${siteUrl}/news/${post.slug}`,
    },
    { siteUrl, unsubscribeUrl: BREVO_UNSUBSCRIBE, mirrorUrl: BREVO_MIRROR },
  )
}

/** Step 1: creates the draft campaign in Brevo (once) and sends a test copy to one address. */
export async function sendArticleTest(articleId: string, testEmail: string, existingCampaignId: number | null): Promise<EmailActionResult> {
  const { supabase } = await requireAdmin()
  const config = getBrevoConfig()
  if (!config.ready) return { ok: false, error: NOT_SET_UP }

  const email = testEmail.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(email)) return { ok: false, error: 'Enter a valid email address for the test.' }

  const loaded = await loadLiveArticle(supabase, articleId)
  if ('error' in loaded) return { ok: false, error: loaded.error }
  const { post } = loaded

  let campaignId = existingCampaignId
  if (!campaignId) {
    const built = buildEmail(post)
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Lagos' })
    const created = await createCampaign({
      name: `News: ${post.title.slice(0, 80)} (${date}) [${campaignMarker(post.id)}]`,
      subject: built.subject,
      previewText: built.previewText,
      htmlContent: built.html,
    })
    if (!created.ok) return { ok: false, error: `Brevo could not create the email: ${created.message}` }
    campaignId = created.data
  }

  const sent = await sendTest(campaignId, [email])
  if (!sent.ok) return { ok: false, error: `Brevo could not send the test: ${sent.message}` }

  return { ok: true, campaignId, message: `Test email sent to ${email}. Check your inbox (and the Promotions or Spam folder).` }
}

/** Step 2: sends the checked campaign to the whole subscriber list. */
export async function sendArticleToSubscribers(articleId: string, campaignId: number, sendAgain: boolean): Promise<EmailActionResult> {
  const { supabase, user } = await requireAdmin()
  const config = getBrevoConfig()
  if (!config.ready) return { ok: false, error: NOT_SET_UP }
  if (!Number.isInteger(campaignId) || campaignId <= 0) return { ok: false, error: 'Send a test email first.' }

  const loaded = await loadLiveArticle(supabase, articleId)
  if ('error' in loaded) return { ok: false, error: loaded.error }
  const { post } = loaded

  if (post.emailed_at && !sendAgain) {
    return { ok: false, error: 'This article was already emailed. Tick the box to confirm you want to send it again.' }
  }

  // The campaign must be the unsent draft that was made for this article.
  const campaign = await getCampaign(campaignId)
  if (!campaign.ok) return { ok: false, error: `Brevo could not find the email: ${campaign.message}` }
  if (campaign.data.name && !campaign.data.name.includes(`[${campaignMarker(post.id)}]`)) return { ok: false, error: 'That email belongs to a different article. Reload the page and start again.' }
  if (campaign.data.status && campaign.data.status !== 'draft') return { ok: false, error: 'That email has already been sent or scheduled.' }

  const subscribers = await getSubscriberCount(config.listId)
  if (subscribers.ok && subscribers.data === 0) return { ok: false, error: 'There are no subscribers to send to yet.' }

  const sent = await sendNow(campaignId)
  if (!sent.ok) {
    const reason = sent.status === 402 ? 'Brevo reports there are not enough sending credits.' : sent.message
    return { ok: false, error: `Brevo could not send the email: ${reason}` }
  }

  await logActivity(user, 'news.emailed', 'Newsletter', post.title)

  const { error } = await supabase.from('news_posts').update({ emailed_at: new Date().toISOString() }).eq('id', post.id)
  if (error) console.error('Could not record that the article was emailed', error.code)

  revalidatePath('/admin/news')
  return { ok: true, campaignId, message: 'Sent! Brevo is delivering the email to your subscribers now.' }
  }
