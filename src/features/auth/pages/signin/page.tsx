"use client"

import { SignInForm } from "@/features/auth/components/sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center px-3 sm:px-6">
      <SignInForm />
    </div>
  )
}
