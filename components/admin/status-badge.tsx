export function StatusBadge({ status, publishedAt }: { status: string; publishedAt?: string | null }) {
  const published = status === 'published'
  const scheduled = published && Boolean(publishedAt) && new Date(publishedAt as string).getTime() > Date.now()
  const style = scheduled ? 'bg-sky-50 text-sky-800' : published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${style}`}>
      {scheduled ? 'Scheduled' : published ? 'Published' : 'Draft'}
    </span>
  )
}
