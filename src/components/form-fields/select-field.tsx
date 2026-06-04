/**
 * Compound Select Field Component
 * 
 * Reusable select field component with label and error handling.
 * Follows compound component pattern for better composition.
 */

'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  required?: boolean
  disabled?: boolean
  className?: string
}

export function SelectField({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  options,
  required = false,
  disabled = false,
  className,
}: SelectFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
