'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'
import { CircleCheck, LoaderCircle, TriangleAlert } from 'lucide-react'
import type { ActionState } from '@/lib/cms-types'

export const inputClass =
  'w-full rounded-xl border border-[#1a1917]/15 bg-white px-4 py-3 text-base text-[#1a1917] outline-none transition-colors placeholder:text-[#1a1917]/40 focus-visible:border-[#d70063] focus-visible:ring-2 focus-visible:ring-[#d70063]/25 sm:text-sm'

export function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-[#1a1917]">{label}</label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-[#1a1917]/55">{hint}</p>}
    </div>
  )
}

export function SubmitButton({ children, pendingLabel = 'Saving…', className = '', name, value }: { children: ReactNode; pendingLabel?: string; className?: string; name?: string; value?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#d70063] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b80055] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d70063] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {pending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
      {pending ? pendingLabel : children}
    </button>
  )
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state?.error && !state?.success) return null
  const isError = Boolean(state.error)
  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${isError ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}
    >
      {isError ? <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <CircleCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
      {state.error ?? state.success}
    </p>
  )
}

export function ConfirmSubmit({ children, message, className = '', ariaLabel }: { children: ReactNode; message: string; className?: string; ariaLabel?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      aria-label={ariaLabel}
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault()
      }}
      className={className}
    >
      {pending ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : children}
    </button>
  )
}
