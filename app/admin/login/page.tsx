import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getAdminSession, hasAnyAdmin } from '@/lib/admin-auth'
import { signOut } from '@/app/admin/actions'
import { LoginForm, SetupForm } from '@/components/admin/login-forms'
import { LOGO_URL } from '@/lib/brand'

export const metadata = { title: 'Admin sign in | DOE Foundation' }

export default async function AdminLoginPage() {
  const [session, adminExists] = await Promise.all([getAdminSession(), hasAnyAdmin()])
  if (session.user && session.isAdmin) redirect('/admin')

  const isSetup = !adminExists

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1a1917]/60 hover:text-[#d70063]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to website
        </Link>
        <div className="rounded-3xl border border-[#1a1917]/10 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(26,25,23,.35)] sm:p-8">
          <img src={LOGO_URL} alt="DOE Foundation" className="mb-5 h-20 w-auto object-contain mix-blend-multiply" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d70063]">DOE Foundation Admin</p>
          <h1 className="mt-2 font-serif text-4xl tracking-[-0.04em]">{isSetup ? 'Create your admin account' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1917]/60">
            {isSetup
              ? 'No admin exists yet. The first account you create here becomes the site owner. This setup closes once it is used.'
              : 'Sign in to manage news, announcements, and impact stats.'}
          </p>

          {session.user && !session.isAdmin ? (
            <div className="mt-6 flex flex-col gap-4">
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                You are signed in as {session.user.email}, which does not have admin access.
              </p>
              <form action={signOut}>
                <button type="submit" className="min-h-11 w-full rounded-full border border-[#1a1917]/20 px-5 text-sm font-semibold hover:border-[#d70063] hover:text-[#d70063]">
                  Sign out and use another account
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-6">{isSetup ? <SetupForm /> : <LoginForm />}</div>
          )}
        </div>
      </div>
    </main>
  )
  }
