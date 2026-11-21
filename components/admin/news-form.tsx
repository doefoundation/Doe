'use client'

import { useActionState, useState } from 'react'
import { ImagePlus, LoaderCircle, Trash2 } from 'lucide-react'
import { saveNews } from '@/app/admin/actions'
import { createClient } from '@/lib/supabase/client'
import { slugify, type NewsPost } from '@/lib/cms-types'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function NewsForm({ post }: { post?: NewsPost }) {
  const [state, action] = useActionState(saveNews, null)
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugEdited, setSlugEdited] = useState(Boolean(post))
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploadError('')
    if (!file.type.startsWith('image/')) return setUploadError('Choose an image file (JPG, PNG, WebP, or GIF).')
    if (file.size > MAX_IMAGE_BYTES) return setUploadError('Image must be 5 MB or smaller.')

    setUploading(true)
    const supabase = createClient()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('news-images').upload(path, file, { contentType: file.type, upsert: false })
    setUploading(false)
    if (error) return setUploadError('Upload failed. Please try again.')
    setCoverUrl(supabase.storage.from('news-images').getPublicUrl(path).data.publicUrl)
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_image_url" value={coverUrl} />

      <div className="flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6 lg:col-span-2">
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            name="title"
            required
            minLength={3}
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
        <Field label="Summary" htmlFor="excerpt" hint="Shown on news cards and search results. Up to 400 characters.">
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={400} defaultValue={post?.excerpt} className={inputClass} />
        </Field>
        <Field label="Content" htmlFor="content" hint="Leave a blank line between paragraphs.">
          <textarea id="content" name="content" rows={14} defaultValue={post?.content} className={`${inputClass} leading-relaxed`} />
        </Field>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6">
          <Field label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={post?.status ?? 'draft'} className={inputClass}>
              <option value="draft">Draft — hidden from website</option>
              <option value="published">Published — visible on website</option>
            </select>
          </Field>
          <Field label="Category" htmlFor="category">
            <input id="category" name="category" list="news-categories" maxLength={60} defaultValue={post?.category ?? 'News'} className={inputClass} />
            <datalist id="news-categories">
              <option value="News" />
              <option value="Events" />
              <option value="Debate" />
              <option value="Scholarships" />
              <option value="Press" />
            </datalist>
          </Field>
          <FormMessage state={state} />
          <SubmitButton className="w-full">{post ? 'Save changes' : 'Save article'}</SubmitButton>
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
            {uploading ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={20} aria-hidden="true" />}
            <span>{uploading ? 'Uploading…' : coverUrl ? 'Replace image' : 'Upload image (max 5 MB)'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} disabled={uploading} className="sr-only" />
          </label>
          {uploadError && <p role="alert" className="text-sm text-red-700">{uploadError}</p>}
        </div>
      </div>
    </form>
  )
}
