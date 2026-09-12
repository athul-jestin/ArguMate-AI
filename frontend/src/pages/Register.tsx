import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

import { authService } from '@services/auth'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await authService.register({ username, email, password })
      toast.success('Account created. Please sign in.')
      navigate('/login')
    } catch (err) {
      const detail = (err as AxiosError<{ detail?: string }>).response?.data?.detail
      toast.error(detail || 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-border bg-surface p-8 shadow-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            ArguMate-AI
          </h1>
          <p className="mt-1 text-sm text-foreground/60">Create your account</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-foreground/60">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
