'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-warm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FDF0ED] border border-[#F5D5CD] mb-4">
            <Lock className="w-8 h-8 text-[#E07862]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Shuto</h1>
          <p className="text-[#717171] mt-1 text-sm">Espace personnel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E3DE] text-[#2C2C2C] placeholder-[#B5B0A8] focus:outline-none focus:border-[#E07862] focus:ring-1 focus:ring-[#E07862]/30 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E3DE] text-[#2C2C2C] placeholder-[#B5B0A8] focus:outline-none focus:border-[#E07862] focus:ring-1 focus:ring-[#E07862]/30 transition-colors"
            />
          </div>

          {error && (
            <p className="text-[#DC6B6B] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E07862] hover:bg-[#D4624C] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-warm-sm"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
