'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Motorbike, Send } from 'lucide-react'

export function PasswordResetRequest() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setIsSubmitted(true)
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Motorbike className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            If an account exists with that email, we&apos;ve sent a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>The link will expire in 1 hour for security reasons.</p>
            <p className="mt-2">Didn&apos;t receive the email? Check your spam folder.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 bg-transparent w-full px-0 py-6 border-none">
          <p className="text-sm text-muted-foreground text-center">
            <Link href="/auth/signin" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Motorbike className="h-8 w-8 text-accent" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-accent">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 bg-transparent w-full px-0 py-6 border-none">
          <Button type="submit" variant="default" size="lg" className="w-full gap-2" disabled={isLoading}>
            <Send className="h-4 w-4" />
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Remember your password?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
