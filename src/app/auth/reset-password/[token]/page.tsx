import { PasswordResetForm } from '@/features/auth/components/password-reset-form'

export default async function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center px-3 sm:px-6">
      <PasswordResetForm token={token} />
    </div>
  )
}
