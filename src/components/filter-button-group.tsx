"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ButtonGroup } from "@/components/ui/button-group"

interface FilterButtonGroupProps {
  label: string
  options: string[]
  activeValue: string
  onSelect: (value: string) => void
  formatFn?: (value: string) => string
  showAllOption?: boolean
}

export function FilterButtonGroup({
  label,
  options,
  activeValue,
  onSelect,
  formatFn,
  showAllOption = true,
}: FilterButtonGroupProps) {
  return (
    <div className="relative">
      <Label className="pb-4 text-xs font-medium">{label}</Label>
      <ButtonGroup>
        {showAllOption && (
          <Button
            type="button"
            size="default"
            variant={activeValue === "" ? "accent" : "secondary"}
            onClick={() => onSelect("")}
            className="text-xs"
          >
            All
          </Button>
        )}
        {options.map((option) => {
          const isActive = activeValue === option
          return (
            <Button
              key={option}
              type="button"
              size="default"
              variant={isActive ? "accent" : "secondary"}
              onClick={() => onSelect(option)}
              className="text-xs"
            >
              {formatFn ? formatFn(option) : option}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
