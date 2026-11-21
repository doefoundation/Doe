'use client'

import { useActionState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteImpactStat, saveImpactStats } from '@/app/admin/actions'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'
import type { ImpactStat } from '@/lib/cms-types'

export function StatsForm({ stats }: { stats: ImpactStat[] }) {
  const [state, action] = useActionState(saveImpactStats, null)

  return (
    <form action={action} className="flex flex-col gap-4">
      <ul className="grid gap-4 md:grid-cols-2">
        {stats.map((stat, index) => (
          <li key={stat.id} className="flex flex-col gap-4 rounded-2xl border border-[#1a1917]/10 bg-white p-5">
            <input type="hidden" name="id" value={stat.id} />
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1a1917]/50">Stat {index + 1}</p>
              <button
                type="submit"
                formAction={deleteImpactStat}
                name="id"
                value={stat.id}
                formNoValidate
                onClick={(event) => {
                  if (!window.confirm(`Remove "${stat.label}" from the homepage?`)) event.preventDefault()
                }}
                aria-label={`Remove ${stat.label}`}
                className="flex size-10 items-center justify-center rounded-full text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_88px] gap-3">
              <Field label="Number" htmlFor={`value-${stat.id}`}>
                <input id={`value-${stat.id}`} name="value" type="number" min={0} step={1} inputMode="numeric" required defaultValue={stat.value} className={`${inputClass} font-serif text-2xl text-[#d70063] sm:text-2xl`} />
              </Field>
              <Field label="Suffix" htmlFor={`suffix-${stat.id}`}>
                <input id={`suffix-${stat.id}`} name="suffix" maxLength={4} defaultValue={stat.suffix} placeholder="+" className={inputClass} />
              </Field>
            </div>
            <Field label="Label" htmlFor={`label-${stat.id}`}>
              <input id={`label-${stat.id}`} name="label" required minLength={2} maxLength={80} defaultValue={stat.label} className={inputClass} />
            </Field>
          </li>
        ))}
      </ul>
      <FormMessage state={state} />
      {stats.length > 0 && (
        <div>
          <SubmitButton>Save all stats</SubmitButton>
        </div>
      )}
    </form>
  )
}
