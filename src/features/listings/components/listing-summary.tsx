import { Category } from "@/types"
import { formatCategory } from "@/lib/formatters"

interface ListingSummaryProps {
  count: number
}

export function ListingSummary({ count }: ListingSummaryProps) {
  return (
    <p className="text-muted-foreground text-sm tracking-wide">
      <span className="text-xs">{count}{(count === 1 ? " listing" : " listings")} found</span> 
    </p>
  )
}
