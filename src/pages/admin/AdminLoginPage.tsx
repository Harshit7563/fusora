import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FusoraLogo } from '../../components/FusoraLogo'
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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = adminLogin(password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/admin', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f5f5f5] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-[#ececec] bg-white p-6 sm:p-8"
      >
        <div className="mb-6 flex justify-center">
          <FusoraLogo centered compact />
        </div>
        <h1 className="text-center text-xl font-medium tracking-wide">
          Admin login
        </h1>
        <p className="mt-2 text-center text-sm text-[#787878]">
          Add products & categories for fusora.shop
        </p>
        <label className="mt-8 block text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-[#ececec] px-3.5 py-3 text-sm outline-none focus:border-[#323232]"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="mt-3 border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#b4232f]">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full bg-[#323232] py-3.5 text-[0.7rem] font-semibold tracking-[0.16em] text-white uppercase"
        >
          Sign in
        </button>
      </form>
    </main>
  )
}
