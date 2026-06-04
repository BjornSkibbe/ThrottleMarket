/**
 * Compound Input Field Component
 * 
 * Reusable input field component with label and error handling.
 * Follows compound component pattern for better composition.
 */

'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface InputFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  min?: number
  max?: number
  className?: string
}

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  min,
  max,
  className,
}: InputFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        className={className}
      />
    </div>
  )
}
