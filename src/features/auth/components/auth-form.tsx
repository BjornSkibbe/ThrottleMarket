'use client'

import Link from 'next/link'
import { Motorbike, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthForm } from '@/features/auth/hooks/use-auth-form'
import { useSignIn } from '@/features/auth/hooks/use-sign-in'
import { useSignUp } from '@/features/auth/hooks/use-sign-up'
import type { LoginInput, RegisterInput, SignUpFormInput } from '@/features/auth/lib/auth.schema'
import { signIn } from 'next-auth/react'

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
    <Card className="flex max-w-lg mx-auto w-full p-6 space-y-6 bg-card">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Motorbike className="h-8 w-8 text-accent" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      {!isSignUp && (
        <div className="px-6 pb-2 space-y-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/marketplace-dashboard' })}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.85 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn('github', { callbackUrl: '/marketplace-dashboard' })}
          >
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
        </div>
      )}
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
          <Button type="submit" variant="default" size="lg" className="w-full gap-2" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            {isLoading ? config.buttonLoadingText : config.buttonText}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {config.footerText}{' '}
            <Link href={config.footerLinkHref} className="text-primary hover:underline">
              {config.footerLinkText}
            </Link>
          </p>
          {!isSignUp && (
            <Link 
              href="/auth/reset-password" 
              className="text-sm text-primary hover:underline text-center"
            >
              Forgot your password?
            </Link>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
