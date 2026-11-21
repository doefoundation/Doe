'use client'

import { useActionState } from 'react'
import { addAdmin } from '@/app/admin/actions'
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/admin/form-ui'

export function AddAdminForm() {
  const [state, action] = useActionState(addAdmin, null)
  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Email address" htmlFor="admin-email">
        <input id="admin-email" name="email" type="email" required autoComplete="off" className={inputClass} />
      </Field>
      <Field label="Temporary password" htmlFor="admin-password" hint="Share it privately. At least 8 characters.">
        <input id="admin-password" name="password" type="text" required minLength={8} autoComplete="off" className={inputClass} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Adding…">Add admin</SubmitButton>
    </form>
  )
}
