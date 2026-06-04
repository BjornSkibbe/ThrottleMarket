import { LucideIcon } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export function PageTitle({
  title,
  description,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <div className="space-y-1 flex flex-col">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-7 w-7" />}
        
        <h1 className="text-4xl font-black tracking-tight">
          {title}
        </h1>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground ml-8">
          {description}
        </p>
      )}
    </div>
  )
}