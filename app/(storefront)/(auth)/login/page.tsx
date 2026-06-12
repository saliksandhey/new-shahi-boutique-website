'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendOTP, verifyOTP } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  
  const [error, setError] = useState<string | null>(errorParam)
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOTP(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await sendOTP(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setStep(2)
    }
    setLoading(false)
  }

  async function handleVerifyOTP(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.append('email', email)
    const result = await verifyOTP(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Redirect after successful login
      router.push('/account/orders')
      router.refresh()
    }
  }

  return (
    <div>
      <h2 className="mt-6 text-2xl font-serif tracking-widest uppercase text-gray-900">
        Welcome Back
      </h2>
      <p className="mt-2 text-sm text-gray-500 font-light">
        {step === 1 ? "Enter your email address and we'll send you a 6-digit code to sign in." : `Enter the 6-digit code sent to ${email}`}
      </p>

      <div className="mt-8">
        {step === 1 ? (
          <form action={handleSendOTP} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full rounded-none"
                  placeholder="customer@example.com"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 p-3 border border-red-200">{error}</p>}

            <div>
              <Button type="submit" className="w-full bg-black text-white rounded-none uppercase tracking-widest h-12" disabled={loading}>
                {loading ? 'Sending code...' : 'Continue with Email'}
              </Button>
            </div>
          </form>
        ) : (
          <form action={handleVerifyOTP} className="space-y-6">
            <div>
              <Label htmlFor="token">6-Digit Code</Label>
              <div className="mt-2">
                <Input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="block w-full rounded-none tracking-[1em] text-center text-lg"
                  placeholder="------"
                  maxLength={6}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 p-3 border border-red-200">{error}</p>}

            <div>
              <Button type="submit" className="w-full bg-black text-white rounded-none uppercase tracking-widest h-12" disabled={loading}>
                {loading ? 'Verifying...' : 'Sign In'}
              </Button>
            </div>
            
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm text-gray-500 underline"
              >
                Use a different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
