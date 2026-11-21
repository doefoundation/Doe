'use client'

import Link from 'next/link'
import { useActionState, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Bold, CalendarClock, ExternalLink, Eye, Heading2, ImagePlus, Italic, Link2, List, ListOrdered, LoaderCircle, Pencil, Quote, RotateCcw, Trash2 } from 'lucide-react'
import { saveNews } from '@/app/admin/actions'
import { createClient } from '@/lib/supabase/client'
import { slugify, type NewsPost } from '@/lib/cms-types'
import { NewsArticle } from '@/components/news-article'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const AUTOSAVE_DELAY_MS = 800

type Mode = 'draft' | 'published' | 'scheduled'
type Edit = { value: string; start: number; end: number }

type Snapshot = {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  coverUrl: string
  mode: Mode
  scheduleAt: string
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Date -> value for <input type="datetime-local"> in the device's timezone. */
function toLocalInput(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toIso(localValue: string) {
  if (!localValue) return ''
  const date = new Date(localValue)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

function formatLagos(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(iso))
}

function initialMode(post?: NewsPost): Mode {
  if (!post || post.status !== 'published') return 'draft'
  return post.published_at && new Date(post.published_at).getTime() > Date.now() ? 'scheduled' : 'published'
}

export function NewsForm({ post }: { post?: NewsPost }) {
  const [state, action] = useActionState(saveNews, null)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const submittedRef = useRef(false)

  const startingMode = initialMode(post)
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(post))
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [category, setCategory] = useState(post?.category ?? 'News')
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '')
  const [mode, setMode] = useState<Mode>(startingMode)
  const [scheduleAt, setScheduleAt] = useState(startingMode === 'scheduled' && post?.published_at ? toLocalInput(new Date(post.published_at)) : '')

  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const [uploading, setUploading] = useState<'cover' | 'inline' | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [restorable, setRestorable] = useState<(Snapshot & { savedAt: number }) | null>(null)
  const [autosavedAt, setAutosavedAt] = useState<number | null>(null)

  const storageKey = `doe-news-draft:${post?.id ?? 'new'}`
  const current: Snapshot = { title, slug, excerpt, content, category, coverUrl, mode, scheduleAt }
  const initialJson = useRef(JSON.stringify(current)).current
  const dirty = JSON.stringify(current) !== initialJson

  const scheduledIso = mode === 'scheduled' ? toIso(scheduleAt) : ''
  const wordCount = useMemo(() => content.trim().split(/\s+/).filter(Boolean).length, [content])

  /* ---------- Autosave to this device ---------- */

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as Snapshot & { savedAt: number }
      const { savedAt: _savedAt, ...fields } = parsed
      if (JSON.stringify(fields) !== initialJson && typeof parsed.content === 'string') setRestorable(parsed)
    } catch {
      /* ignore unreadable drafts */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!dirty || restorable) return
    const timer = window.setTimeout(() => {
      try {
        const savedAt = Date.now()
        window.localStorage.setItem(storageKey, JSON.stringify({ ...current, savedAt }))
        setAutosavedAt(savedAt)
      } catch {
        /* storage full or blocked: autosave is best effort */
      }
    }, AUTOSAVE_DELAY_MS)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, excerpt, content, category, coverUrl, mode, scheduleAt, restorable])

  // Clear the local copy once the article has been saved successfully (the page redirects, so the form unmounts).
  useEffect(() => {
    if (state?.error) submittedRef.current = false
  }, [state])
  useEffect(
    () => () => {
      if (submittedRef.current) {
        try {
          window.localStorage.removeItem(storageKey)
        } catch {
          /* ignore */
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => {
      if (submittedRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  function restoreDraft() {
    if (!restorable) return
    setTitle(restorable.title)
    setSlug(restorable.slug)
    setSlugEdited(true)
    setExcerpt(restorable.excerpt)
    setContent(restorable.content)
    setCategory(restorable.category)
    setCoverUrl(restorable.coverUrl)
    setMode(restorable.mode)
    setScheduleAt(restorable.scheduleAt)
    setRestorable(null)
  }

  function discardDraft() {
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setRestorable(null)
  }

  /* ---------- Editor toolbar ---------- */

  function applyEdit(compute: (value: string, start: number, end: number) => Edit) {
    const element = textareaRef.current
    if (!element) return
    const result = compute(content, element.selectionStart, element.selectionEnd)
    setContent(result.value)
    requestAnimationFrame(() => {
      element.focus()
      element.setSelectionRange(result.start, result.end)
    })
  }

  function wrap(before: string, after: string, placeholder: string) {
    applyEdit((value, start, end) => {
      const selected = value.slice(start, end) || placeholder
      return {
        value: value.slice(0, start) + before + selected + after + value.slice(end),
        start: start + before.length,
        end: start + before.length + selected.length,
      }
    })
  }

  function formatLines(kind: 'heading' | 'bullet' | 'number' | 'quote') {
    applyEdit((value, start, end) => {
      const lineStart = start === 0 ? 0 : value.lastIndexOf('\n', start - 1) + 1
      const nextBreak = value.indexOf('\n', end)
      const lineEnd = nextBreak === -1 ? value.length : nextBreak
      const lines = value.slice(lineStart, lineEnd).split('\n')
      const formatted = lines
        .map((line, index) => {
          if (kind === 'heading') return /^##\s/.test(line) ? line.replace(/^##\s/, '') : `## ${line.replace(/^#{1,6}\s/, '')}`
          if (kind === 'bullet') return `- ${line}`
          if (kind === 'number') return `${index + 1}. ${line}`
          return `> ${line}`
        })
        .join('\n')
      return { value: value.slice(0, lineStart) + formatted + value.slice(lineEnd), start: lineStart, end: lineStart + formatted.length }
    })
  }

  function insertLink() {
    applyEdit((value, start, end) => {
      const label = value.slice(start, end) || 'link text'
      const insertion = `[${label}](https://)`
      const urlStart = start + label.length + 3
      return { value: value.slice(0, start) + insertion + value.slice(end), start: urlStart, end: urlStart + 8 }
    })
  }

  function handleEditorKeys(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey)) return
    const key = event.key.toLowerCase()
    if (key === 'b') {
      event.preventDefault()
      wrap('**', '**', 'bold text')
    } else if (key === 'i') {
      event.preventDefault()
      wrap('*', '*', 'italic text')
    } else if (key === 'k') {
      event.preventDefault()
      insertLink()
    }
  }

  /* ---------- Image uploads ---------- */

  async function uploadImage(file: File): Promise<string | null> {
    setUploadError('')
    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file (JPG, PNG, WebP, or GIF).')
      return null
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError('Image must be 5 MB or smaller.')
      return null
    }
    const supabase = createClient()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('news-images').upload(path, file, { contentType: file.type, upsert: false })
    if (error) {
      setUploadError('Upload failed. Please try again.')
      return null
    }
    return supabase.storage.from('news-images').getPublicUrl(path).data.publicUrl
  }

  async function handleCoverUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading('cover')
    const url = await uploadImage(file)
    setUploading(null)
    if (url) setCoverUrl(url)
  }

  async function handleInlineUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading('inline')
    const url = await uploadImage(file)
    setUploading(null)
    if (!url) return
    applyEdit((value, start, end) => {
      const caption = value.slice(start, end)
      const before = value.slice(0, start)
      const lead = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : ''
      const insertion = `${lead}

![${caption}](${url})

\n\n`
      return { value: before + insertion + value.slice(end), start: start + insertion.length, end: start + insertion.length }
    })
  }

  /* ---------- Submit ---------- */

  const submitLabel = mode === 'draft' ? 'Save draft' : mode === 'scheduled' ? 'Schedule article' : post?.status === 'published' && initialMode(post) === 'published' ? 'Update article' : 'Publish now'
  const minSchedule = toLocalInput(new Date(Date.now() + 5 * 60_000))

  const toolButton = 'flex size-9 items-center justify-center rounded-lg text-[#1a1917]/70 transition-colors hover:bg-[#f1c6d7]/45 hover:text-[#d70063] focus-visible:outline-2 focus-visible:outline-[#d70063] disabled:opacity-50'
  const tabButton = (active: boolean) =>
    `inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#d70063] ${active ? 'bg-[#1a1917] text-white' : 'text-[#1a1917]/65 hover:bg-[#1a1917]/8'}`

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      onSubmit={() => {
        submittedRef.current = true
      }}
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault()
          formRef.current?.requestSubmit()
        }
      }}
      className="grid gap-6 lg:grid-cols-3"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <input type="hidden" name="status" value={mode === 'draft' ? 'draft' : 'published'} />
      <input type="hidden" name="publish_mode" value={mode} />
      <input type="hidden" name="published_at" value={scheduledIso} />

      <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
        {restorable && (
          <div role="status" className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold">Unsaved changes found.</span> A copy from {new Date(restorable.savedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })} was saved on this device.
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={restoreDraft} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-amber-900 px-4 font-semibold text-white hover:bg-amber-950">
                <RotateCcw size={14} aria-hidden="true" /> Restore
              </button>
              <button type="button" onClick={discardDraft} className="inline-flex min-h-10 items-center rounded-full border border-amber-900/30 px-4 font-semibold hover:bg-amber-100">
                Discard
              </button>
            </div>
          </div>
        )}

        <div role="tablist" aria-label="Editor view" className="flex w-fit gap-1 rounded-full bg-white p-1 ring-1 ring-[#1a1917]/10">
          <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')} className={tabButton(tab === 'write')}>
            <Pencil size={14} aria-hidden="true" /> Write
          </button>
          <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')} className={tabButton(tab === 'preview')}>
            <Eye size={14} aria-hidden="true" /> Preview
          </button>
        </div>

        <div className={tab === 'preview' ? 'hidden' : 'flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6'}>
          <Field label="Title" htmlFor="title">
            <input
              id="title"
              name="title"
              maxLength={200}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (!slugEdited) setSlug(slugify(event.target.value))
              }}
              className={`${inputClass} font-serif text-xl sm:text-xl`}
              placeholder="DOE students win national debate championship"
            />
          </Field>
          <Field label="URL slug" htmlFor="slug" hint={`Appears as /news/${slug || 'your-article'}`}>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true)
                setSlug(slugify(event.target.value))
              }}
              className={inputClass}
              inputMode="url"
            />
          </Field>
          <Field label="Summary" htmlFor="excerpt" hint={`Shown on news cards and search results. ${excerpt.length}/400 characters.`}>
            <textarea id="excerpt" name="excerpt" rows={3} maxLength={400} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className={inputClass} />
          </Field>

          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-semibold text-[#1a1917]">Content</label>
            <div className="overflow-hidden rounded-xl border border-[#1a1917]/15 focus-within:border-[#d70063] focus-within:ring-2 focus-within:ring-[#d70063]/25">
              <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-[#1a1917]/10 bg-[#f8f5ef] p-1.5">
                <button type="button" onClick={() => formatLines('heading')} aria-label="Heading" title="Heading" className={toolButton}><Heading2 size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => wrap('**', '**', 'bold text')} aria-label="Bold (Ctrl+B)" title="Bold (Ctrl+B)" className={toolButton}><Bold size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => wrap('*', '*', 'italic text')} aria-label="Italic (Ctrl+I)" title="Italic (Ctrl+I)" className={toolButton}><Italic size={17} aria-hidden="true" /></button>
                <button type="button" onClick={insertLink} aria-label="Link (Ctrl+K)" title="Link (Ctrl+K)" className={toolButton}><Link2 size={17} aria-hidden="true" /></button>
                <span className="mx-1 h-5 w-px bg-[#1a1917]/15" aria-hidden="true" />
                <button type="button" onClick={() => formatLines('bullet')} aria-label="Bulleted list" title="Bulleted list" className={toolButton}><List size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => formatLines('number')} aria-label="Numbered list" title="Numbered list" className={toolButton}><ListOrdered size={17} aria-hidden="true" /></button>
                <button type="button" onClick={() => formatLines('quote')} aria-label="Quote" title="Quote" className={toolButton}><Quote size={17} aria-hidden="true" /></button>
                <span className="mx-1 h-5 w-px bg-[#1a1917]/15" aria-hidden="true" />
                <label className={`${toolButton} cursor-pointer`} title="Insert image" aria-label="Insert image">
                  {uploading === 'inline' ? <LoaderCircle size={17} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={17} aria-hidden="true" />}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleInlineUpload} disabled={uploading !== null} className="sr-only" />
                </label>
              </div>
              <textarea
                id="content"
                name="content"
                ref={textareaRef}
                rows={16}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onKeyDown={handleEditorKeys}
                placeholder="Write your story here. Leave a blank line between paragraphs."
                className="block w-full resize-y bg-white px-4 py-3 text-base leading-relaxed outline-none placeholder:text-[#1a1917]/40 sm:text-sm"
              />
            </div>
            <p className="text-xs leading-relaxed text-[#1a1917]/55">
              {wordCount} {wordCount === 1 ? 'word' : 'words'} · {Math.max(1, Math.round(wordCount / 200))} min read · Use the toolbar, or type <code>## Heading</code>, <code>**bold**</code>, <code>*italic*</code>, <code>- list</code>.
            </p>
          </div>
        </div>

        {tab === 'preview' && (
          <div className="overflow-hidden rounded-2xl border border-[#1a1917]/10 bg-[#f8f5ef]">
            <p className="border-b border-[#1a1917]/10 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#1a1917]/55">Live preview · how the article will look on the website</p>
            <NewsArticle
              showBackLink={false}
              post={{
                title,
                excerpt,
                content,
                category: category || 'News',
                cover_image_url: coverUrl || null,
                published_at: scheduledIso || post?.published_at || new Date().toISOString(),
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <Field label="Status" htmlFor="mode">
            <select id="mode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className={inputClass}>
              <option value="draft">Draft — hidden from website</option>
              <option value="published">{initialMode(post) === 'published' ? 'Published — visible on website' : 'Publish now'}</option>
              <option value="scheduled">Schedule for later</option>
            </select>
          </Field>

          {mode === 'scheduled' && (
            <Field label="Publish date and time" htmlFor="schedule_at" hint={scheduledIso ? `Goes live ${formatLagos(scheduledIso)} (Nigeria time).` : 'Pick when this article should appear on the website.'}>
              <div className="relative">
                <CalendarClock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#d70063]" aria-hidden="true" />
                <input
                  id="schedule_at"
                  type="datetime-local"
                  min={minSchedule}
                  value={scheduleAt}
                  suppressHydrationWarning
                  onChange={(event) => setScheduleAt(event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          )}

          <Field label="Category" htmlFor="category">
            <input id="category" name="category" list="news-categories" maxLength={60} value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass} />
            <datalist id="news-categories">
              <option value="News" />
              <option value="Events" />
              <option value="Debate" />
              <option value="Scholarships" />
              <option value="Press" />
            </datalist>
          </Field>

          <FormMessage state={state} />
          <SubmitButton className="w-full">{submitLabel}</SubmitButton>

          <p className="text-center text-xs text-[#1a1917]/55" aria-live="polite">
            {dirty ? (autosavedAt ? `Unsaved changes · copy kept on this device at ${new Date(autosavedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Unsaved changes') : 'All changes saved'} · Ctrl+S to save
          </p>

          {post && (
            <Link href={`/admin/preview/${post.id}`} target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#1a1917]/15 px-4 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">
              <ExternalLink size={15} aria-hidden="true" /> Preview on site
            </Link>
          )}
          {post && <p className="-mt-3 text-center text-xs text-[#1a1917]/50">Shows the last saved version with the real header and footer.</p>}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold">Cover image</p>
          {coverUrl ? (
            <div className="relative overflow-hidden rounded-xl">
              <img src={coverUrl} alt="Cover preview" className="aspect-[16/10] w-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverUrl('')}
                className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/90 text-red-700 hover:bg-white"
                aria-label="Remove cover image"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#1a1917]/20 px-4 py-5 text-center text-sm text-[#1a1917]/65 transition-colors focus-within:border-[#d70063] hover:border-[#d70063] hover:text-[#d70063]">
            {uploading === 'cover' ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={20} aria-hidden="true" />}
            <span>{uploading === 'cover' ? 'Uploading…' : coverUrl ? 'Replace image' : 'Upload image (max 5 MB)'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleCoverUpload} disabled={uploading !== null} className="sr-only" />
          </label>
          {uploadError && <p role="alert" className="text-sm text-red-700">{uploadError}</p>}
        </div>
      </div>
    </form>
  )
}
