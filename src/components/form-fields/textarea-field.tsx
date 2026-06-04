/**
 * Compound Textarea Field Component
 * 
 * Reusable textarea field component with label and error handling.
 * Follows compound component pattern for better composition.
 */

'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TextareaFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
  className?: string
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  className,
}: TextareaFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        rows={rows}
        className={className}
      />
    </div>
  )
}
