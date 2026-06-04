'use client'

import { useCallback, useMemo, useState } from 'react'
import { z } from 'zod'
import { validateResult } from '@/lib/validation/validators'
import { loginSchema, signUpFormSchema, type LoginInput, type SignUpFormInput } from '@/features/auth/lib/auth.schema'

type AuthFormMode = 'signin' | 'signup'

type AuthFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FieldErrors = Partial<Record<keyof AuthFormData, string>>

type SignInAuthForm = {
  formData: AuthFormData
  fieldErrors: FieldErrors
  formError: string
  isValid: boolean
  handleChange: (field: keyof AuthFormData, value: string) => void
  validateForm: () => LoginInput | null
  setFormError: (error: string) => void
}

type SignUpAuthForm = {
  formData: AuthFormData
  fieldErrors: FieldErrors
  formError: string
  isValid: boolean
  handleChange: (field: keyof AuthFormData, value: string) => void
  validateForm: () => SignUpFormInput | null
  setFormError: (error: string) => void
}

const initialFormData: AuthFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function getFieldErrors(error: unknown): FieldErrors {
  if (!(error instanceof z.ZodError)) {
    return {}
  }

  return error.issues.reduce<FieldErrors>((acc, issue) => {
    const field = issue.path[0] as keyof AuthFormData | undefined

    if (field && !acc[field]) {
      acc[field] = issue.message
    }

    return acc
  }, {})
}

export function useAuthForm(mode: 'signin'): SignInAuthForm
export function useAuthForm(mode: 'signup'): SignUpAuthForm
export function useAuthForm(mode: AuthFormMode): SignInAuthForm | SignUpAuthForm {
  const [formData, setFormData] = useState<AuthFormData>(initialFormData)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')

  const schema = mode === 'signin' ? loginSchema : signUpFormSchema

  const handleChange = useCallback((field: keyof AuthFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }, [])

  const getSubmissionData = useCallback((): LoginInput | SignUpFormInput | null => {
    if (mode === 'signin') {
      return {
        email: formData.email,
        password: formData.password,
      }
    }

    return {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    }
  }, [formData, mode])

  const validateForm = useCallback(() => {
    setFormError('')

    const data = getSubmissionData()

    if (!data) {
      return null
    }

    const result = validateResult(schema, data)

    if (result.isFailure()) {
      const zodError = result.error.context?.zodError
      setFieldErrors(getFieldErrors(zodError))
      setFormError(result.error.message)
      return null
    }

    setFieldErrors({})
    return result.value
  }, [getSubmissionData, schema])

  const isValid = useMemo(() => {
    const data = mode === 'signin'
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }

    return schema.safeParse(data).success
  }, [formData, mode, schema])

  return {
    formData,
    fieldErrors,
    formError,
    isValid,
    handleChange,
    validateForm,
    setFormError,
  }
}
