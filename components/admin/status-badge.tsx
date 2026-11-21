export function StatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
