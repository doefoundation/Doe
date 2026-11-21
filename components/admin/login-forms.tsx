'use client'

import { useActionState } from 'react'
import { setupFirstAdmin, signIn } from '@/app/admin/actions'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'

export function LoginForm() {
  const [state, action] = useActionState(signIn, null)
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Email address" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="info@thedoefoundation.com" />
      </Field>
      <Field label="Password" htmlFor="password">
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Signing in…" className="w-full">Sign in</SubmitButton>
    </form>
  )
}

export function SetupForm() {
  const [state, action] = useActionState(setupFirstAdmin, null)
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Email address" htmlFor="email">
        <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters.">
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </Field>
      <Field label="Confirm password" htmlFor="confirm">
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Creating account…" className="w-full">Create admin account</SubmitButton>
    </form>
  )
}
