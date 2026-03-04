import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

export default function Gate() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const nextRoute = typeof router.query.next === 'string' ? router.query.next : '/'

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (!response.ok) {
      setError('Wrong password. Try again.')
      setLoading(false)
      return
    }

    await router.push(nextRoute)
  }

  return (
    <>
      <PageSEO
        title={`${siteMetadata.author} | Access`}
        description="Password protected website access"
      />
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 sm:px-8">
        <section className="apple-glass-card w-full p-8 md:p-12">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary-500 uppercase">
            Private Access
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            Enter password to continue
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            {siteMetadata.title} is currently in protected mode.
          </p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-gray-900 outline-none ring-primary-500 transition focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder="Website password"
            />
            <button
              type="submit"
              disabled={loading}
              className="apple-button-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Checking...' : 'Unlock website'}
            </button>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </form>
        </section>
      </main>
    </>
  )
}
