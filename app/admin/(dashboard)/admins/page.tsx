import { UserMinus } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { removeAdmin } from '@/app/admin/actions'
import { PageHeading } from '@/components/admin/admin-shell'
import { AddAdminForm } from '@/components/admin/add-admin-form'
import { ConfirmSubmit } from '@/components/admin/form-ui'
import { formatDate } from '@/lib/cms-types'

export default async function AdminUsersPage() {
  const { supabase, user } = await requireAdmin()
  const { data: admins } = await supabase.from('admin_users').select('user_id, email, created_at').order('created_at')

  return (
    <>
      <PageHeading eyebrow="Access" title="Admins" description="People who can sign in at /admin and manage the website." />
      <div className="grid gap-6 lg:grid-cols-5">
        <section aria-labelledby="admin-list" className="lg:col-span-3">
          <h2 id="admin-list" className="sr-only">Current admins</h2>
          <ul className="flex flex-col gap-3">
            {admins?.map((admin) => (
              <li key={admin.user_id} className="flex items-center gap-4 rounded-2xl border border-[#1a1917]/10 bg-white p-4 sm:p-5">
                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f1c6d7]/50 font-semibold uppercase text-[#d70063]">{admin.email.charAt(0)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{admin.email}{admin.user_id === user.id && <span className="ml-2 text-xs text-[#1a1917]/50">(you)</span>}</p>
                  <p className="text-xs text-[#1a1917]/50">Added {formatDate(admin.created_at)}</p>
                </div>
                {admin.user_id !== user.id && (
                  <form action={removeAdmin}>
                    <input type="hidden" name="user_id" value={admin.user_id} />
                    <ConfirmSubmit
                      message={`Remove admin access for ${admin.email}?`}
                      ariaLabel={`Remove ${admin.email}`}
                      className="flex size-11 items-center justify-center rounded-full border border-[#1a1917]/15 text-red-700 hover:border-red-300 hover:bg-red-50"
                    >
                      <UserMinus size={16} aria-hidden="true" />
                    </ConfirmSubmit>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="add-admin" className="rounded-2xl border border-[#1a1917]/10 bg-white p-5 sm:p-6 lg:col-span-2 lg:self-start">
          <h2 id="add-admin" className="mb-5 font-semibold">Add an admin</h2>
          <AddAdminForm />
        </section>
      </div>
    </>
  )
}
