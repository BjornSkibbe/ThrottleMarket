"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FilterSelectProps {
  label: string
  id: string
  value: string
  onValueChange: (value: string) => void
  options: Record<string, string>
  formatFn?: (value: string) => string
  placeholder?: string
  showAllOption?: boolean
  counts?: Record<string, number>
}

export function FilterSelect({
  label,
  id,
  value,
  onValueChange,
  options,
  formatFn,
  placeholder = "All",
  showAllOption = true,
  counts,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <Label htmlFor={id} className="text-xs font-medium pb-4">{label}</Label>
      <Select value={value || "all"} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="border-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="p-2 bg-background/70 backdrop-blur-lg ring-0">
          {showAllOption && <SelectItem value="all">All</SelectItem>}
          {Object.values(options).map((option) => (
            <SelectItem key={option} value={option}>
              {formatFn ? formatFn(option) : option}
              {counts && counts[option] !== undefined && (
                <Badge variant="outline" className="font-bold text-xs">{counts[option]}</Badge>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
