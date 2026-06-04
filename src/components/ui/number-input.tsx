import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value: string
  onChange: (value: string) => void
  step?: number
  min?: number
  max?: number
}

function NumberInput({
  className,
  value,
  onChange,
  step = 1,
  min,
  max,
  disabled,
  ...props
}: NumberInputProps) {
  const numericValue = parseFloat(value) || 0

  const handleDecrement = () => {
    const newValue = numericValue - step
    if (min !== undefined && newValue < min) {
      onChange(min.toString())
    } else {
      onChange(newValue.toString())
    }
  }

  const handleIncrement = () => {
    const newValue = numericValue + step
    if (max !== undefined && newValue > max) {
      onChange(max.toString())
    } else {
      onChange(newValue.toString())
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute left-0 z-10 h-[48px] w-10 rounded-r-none rounded-l-lg border-r-0"
        onClick={handleDecrement}
        disabled={disabled || (min !== undefined && numericValue <= min)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        className="h-[48px] w-full rounded-lg px-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        {...props}
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute right-0 z-10 h-[48px] w-10 rounded-l-none rounded-r-lg border-l-0"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && numericValue >= max)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export { NumberInput }
