import { Plus } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { addImpactStat } from '@/app/admin/actions'
import { PageHeading } from '@/components/admin/admin-shell'
import { StatsForm } from '@/components/admin/stats-form'
import { SubmitButton } from '@/components/admin/form-ui'
import type { ImpactStat } from '@/lib/cms-types'

export default async function AdminStatsPage() {
  const { supabase } = await requireAdmin()
  const { data } = await supabase.from('impact_stats').select('id, label, value, suffix, sort_order').order('sort_order')
  const stats = (data ?? []) as ImpactStat[]

  return (
    <>
      <PageHeading
        eyebrow="Website"
        title="Impact stats"
        description={'The animated figures in the "Change you can count" section of the homepage. Keep an even number so the grid stays balanced.'}
        action={
          <form action={addImpactStat}>
            <SubmitButton pendingLabel="Adding…" className="!bg-white !text-[#1a1917] border border-[#1a1917]/15 hover:!border-[#d70063]">
              <Plus size={16} aria-hidden="true" /> Add stat
            </SubmitButton>
          </form>
        }
      />
      <StatsForm key={stats.map((s) => s.id).join()} stats={stats} />
    </>
  )
}
