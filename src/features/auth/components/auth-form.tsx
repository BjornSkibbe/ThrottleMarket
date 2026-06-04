'use client'

import Link from 'next/link'
import { Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthForm } from '@/features/auth/hooks/use-auth-form'
import { useSignIn } from '@/features/auth/hooks/use-sign-in'
import { useSignUp } from '@/features/auth/hooks/use-sign-up'
import type { LoginInput, RegisterInput, SignUpFormInput } from '@/features/auth/lib/auth.schema'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An error occurred. Please try again.'
}

const CONFIG = {
  signin: {
    title: 'Welcome back',
    description: 'Sign in to your ThrottleMarket account',
    buttonText: 'Sign In',
    buttonLoadingText: 'Signing in...',
    footerText: "Don't have an account?",
    footerLinkText: 'Sign up',
    footerLinkHref: '/auth/signup',
  },
  signup: {
    title: 'Create an account',
    description: 'Join ThrottleMarket to buy and sell motorcycles and gear',
    buttonText: 'Sign Up',
    buttonLoadingText: 'Creating account...',
    footerText: 'Already have an account?',
    footerLinkText: 'Sign in',
    footerLinkHref: '/auth/signin',
  },
} as const

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const config = CONFIG[mode]
  const isSignUp = mode === 'signup'

  const signinForm = useAuthForm('signin')
  const signupForm = useAuthForm('signup')
  const authForm = isSignUp ? signupForm : signinForm
  const { formData, fieldErrors, formError, handleChange, validateForm, setFormError } = authForm
  const signInMutation = useSignIn()
  const signUpMutation = useSignUp()

  const mutation = isSignUp ? signUpMutation : signInMutation
  const isLoading = mutation.isPending
  const error = mutation.error ? getErrorMessage(mutation.error) : formError

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = validateForm()

    if (!data) {
      return
    }

    setFormError('')

    if (isSignUp) {
      const { confirmPassword, ...registerData } = data as SignUpFormInput
      signUpMutation.mutate(registerData as RegisterInput)
    } else {
      signInMutation.mutate(data as LoginInput)
    }
  }

  return (
    <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Bike className="h-8 w-8 text-accent" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md" role="alert">
              {error}
            </div>
          )}
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
                required
                disabled={isLoading}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
              disabled={isLoading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(event) => handleChange('password', event.target.value)}
              required
              disabled={isLoading}
              minLength={isSignUp ? 8 : undefined}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="text-sm text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
                required
                disabled={isLoading}
                minLength={8}
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              {fieldErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 bg-transparent w-full px-0 py-6 border-none">
          <Button type="submit" variant="default" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? config.buttonLoadingText : config.buttonText}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {config.footerText}{' '}
            <Link href={config.footerLinkHref} className="text-primary hover:underline">
              {config.footerLinkText}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
