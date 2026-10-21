import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { adminLogin, isAdminLoggedIn } from '../../lib/adminCatalog'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminLoginPage() {
  usePageTitle('Admin login')
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const result = await adminLogin(password)
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#1a1a1a] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 sm:p-8">
        <h1 className="mb-1 text-center text-xl font-bold">Admin Login</h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Fusora · fusora.shop
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="h-11 w-full rounded-lg border border-[#e8e8e8] px-4 text-sm focus:border-[#1a1a1a] focus:outline-none"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-full bg-[#1a1a1a] font-semibold text-white disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
