import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabaseClient'

const demoUnlockKey = 'iron-ink-bridge:admin-demo-unlock'

function parseAllowedEmails(rawValue) {
  return rawValue
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function getRedirectUrl() {
  const explicitRedirect = import.meta.env.VITE_ADMIN_REDIRECT_URL?.trim()

  if (explicitRedirect) {
    return explicitRedirect
  }

  if (typeof window === 'undefined') {
    return undefined
  }

  return `${window.location.origin}/admin`
}

export default function AdminAuthGate({ children }) {
  const allowedEmails = useMemo(
    () => parseAllowedEmails(import.meta.env.VITE_ADMIN_EMAILS ?? ''),
    [],
  )
  const demoPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim() ?? ''
  const demoPasswordEnabled = Boolean(demoPassword)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [demoUnlocked, setDemoUnlocked] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.sessionStorage.getItem(demoUnlockKey) === 'true'
  })
  const [demoPasswordInput, setDemoPasswordInput] = useState('')
  const [demoPasswordError, setDemoPasswordError] = useState('')

  useEffect(() => {
    if (!supabaseConfigured) {
      setError(
        demoPasswordEnabled
          ? ''
          : 'Supabase is not configured yet. Add the public URL and anon key to your environment.',
      )
      setLoading(false)
      return undefined
    }

    let active = true

    const syncSession = async () => {
      const { data, error: authError } = await supabase.auth.getUser()

      if (!active) {
        return
      }

      if (authError) {
        setError(authError.message)
        setUser(null)
      } else {
        setUser(data.user ?? null)
        setError('')
      }
      setLoading(false)
    }

    syncSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return
      }

      setUser(session?.user ?? null)
      setError('')
      setLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const email = user?.email?.toLowerCase() ?? ''
  const hasAllowlist = allowedEmails.length > 0
  const isAllowed = hasAllowlist && Boolean(email) && allowedEmails.includes(email)
  const canUseDemoPassword = demoPasswordEnabled && demoUnlocked
  const isAuthorized = isAllowed || canUseDemoPassword
  const needsAuthSetup = (!supabaseConfigured && !demoPasswordEnabled) || (!hasAllowlist && !demoPasswordEnabled)

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError('Supabase client is not ready.')
      return
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    })

    if (authError) {
      setError(authError.message)
    }
  }

  const unlockDemoPassword = async (event) => {
    event.preventDefault()

    if (!demoPasswordEnabled) {
      return
    }

    if (demoPasswordInput !== demoPassword) {
      setDemoPasswordError('Incorrect demo password.')
      return
    }

    window.sessionStorage.setItem(demoUnlockKey, 'true')
    setDemoUnlocked(true)
    setDemoPasswordError('')
    setDemoPasswordInput('')
  }

  const signOut = async () => {
    window.sessionStorage.removeItem(demoUnlockKey)
    setDemoUnlocked(false)
    setDemoPasswordError('')
    setDemoPasswordInput('')

    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_54%,#eef5ff_100%)] text-ink-950">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-[2rem] border border-ink-100 bg-white p-8 text-center shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Admin access</p>
            <h1 className="mt-3 font-display text-3xl text-ink-950">Checking your session</h1>
            <p className="mt-3 text-sm leading-7 text-ink-700">Loading the private dashboard access check.</p>
          </div>
        </div>
      </div>
    )
  }

  if ((error || !supabaseConfigured || !hasAllowlist) && needsAuthSetup) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_54%,#eef5ff_100%)] text-ink-950">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-[2rem] border border-ink-100 bg-white p-8 shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Admin access</p>
            <h1 className="mt-3 font-display text-3xl text-ink-950">OAuth setup needed</h1>
            <p className="mt-3 text-sm leading-7 text-ink-700">
              {error || 'Configure Supabase to use the private dashboard.'}
            </p>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
              Add <code className="rounded bg-white px-1 py-0.5">VITE_SUPABASE_URL</code>,
              <code className="rounded bg-white px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code>, and
              <code className="rounded bg-white px-1 py-0.5">VITE_ADMIN_EMAILS</code> before testing sign in.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_54%,#eef5ff_100%)] text-ink-950">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-[2rem] border border-ink-100 bg-white p-8 shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Private preview</p>
            <h1 className="mt-3 font-display text-3xl text-ink-950">Open the Client Scan Dashboard</h1>
            <p className="mt-3 text-sm leading-7 text-ink-700">
              Google sign-in is the production path. If you only need a demo unlock, you can use the fallback password.
            </p>

            <div className="mt-6 grid gap-4">
              {supabaseConfigured ? (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                >
                  Continue with Google
                </button>
              ) : null}

              {demoPasswordEnabled ? (
                <form onSubmit={unlockDemoPassword} className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-600">Demo fallback</p>
                  <label className="mt-3 block text-sm font-medium text-ink-800">
                    Local admin password
                    <input
                      type="password"
                      value={demoPasswordInput}
                      onChange={(event) => {
                        setDemoPasswordInput(event.target.value)
                        setDemoPasswordError('')
                      }}
                      className="mt-2 w-full rounded-2xl border border-ink-200 px-4 py-3 outline-none transition focus:border-ink-500"
                      placeholder="Enter demo password"
                    />
                  </label>
                  {demoPasswordError ? (
                    <p className="mt-2 text-sm text-red-700">{demoPasswordError}</p>
                  ) : null}
                  <p className="mt-3 text-xs leading-6 text-ink-600">
                    This is only a convenience fallback for demos. Do not treat it as real security.
                  </p>
                  <button
                    type="submit"
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-white"
                  >
                    Unlock demo
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user && !isAuthorized) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_54%,#eef5ff_100%)] text-ink-950">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-[2rem] border border-ink-100 bg-white p-8 shadow-panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-600">Access denied</p>
            <h1 className="mt-3 font-display text-3xl text-ink-950">This Google account is not on the allowlist</h1>
            <p className="mt-3 text-sm leading-7 text-ink-700">
              Signed in as <span className="font-semibold">{user.email}</span>.
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-700">
              Update <code className="rounded bg-ink-50 px-1 py-0.5">VITE_ADMIN_EMAILS</code> to include this address.
            </p>
            {demoPasswordEnabled ? (
              <p className="mt-2 text-sm leading-7 text-ink-700">
                Or use the demo password fallback if you just need to get into the dashboard quickly.
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center justify-center rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
              >
                Sign out
              </button>
              <button
                type="button"
                onClick={signIn}
                className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
              >
                Try a different account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={signOut}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/15 bg-ink-950/90 px-4 py-2 text-sm font-semibold text-white shadow-2xl backdrop-blur transition hover:bg-ink-800"
      >
        {canUseDemoPassword ? 'Exit demo' : 'Sign out'}
      </button>
      {children}
    </>
  )
}
