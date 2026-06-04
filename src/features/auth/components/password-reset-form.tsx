'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Motorbike } from 'lucide-react'

export function PasswordResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Validate token when component mounts
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/password-reset/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid or expired reset link')
          setIsValidToken(false)
          return
        }

        setIsValidToken(true)
      } catch (error) {
        setError('Failed to validate reset link')
        setIsValidToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setIsSuccess(true)
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidToken === null) {
    return (
      <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Motorbike className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Validating...</CardTitle>
          <CardDescription>Please wait while we validate your reset link.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isValidToken === false) {
    return (
      <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-accent/10">
              <Motorbike className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
          <CardDescription>{error || 'This reset link is invalid or has expired.'}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/reset-password" className="w-full">
            <Button variant="default" className="w-full">
              Request New Reset Link
            </Button>
          </Link>
          <Link href="/auth/signin" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Motorbike className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
          <CardDescription>Your password has been successfully reset.</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/auth/signin" className="w-full">
            <Button variant="default" className="w-full">
              Sign In with New Password
            </Button>
          </Link>
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
        <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          {error && (
            <p className="text-sm text-accent">{error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" variant="default" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <Link href="/auth/signin" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
