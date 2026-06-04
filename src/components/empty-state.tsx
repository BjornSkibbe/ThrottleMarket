import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, className, action }: EmptyStateProps) {
  return (
    <div className="p-6 w-full">
      <Card className={className || "bg-transparent"}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Icon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-center mb-4">
            {description}
          </p>
          {action && <div className="mt-4">{action}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
