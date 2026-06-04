import { PasswordResetRequest } from '@/features/auth/components/password-reset-request'

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-3 sm:px-6">
      <PasswordResetRequest />
    </div>
  )
}
