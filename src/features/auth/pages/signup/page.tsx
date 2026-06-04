"use client"

import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center px-3 sm:px-6">
      <SignUpForm />
    </div>
  )
}
