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
    <div className="flex flex-col space-y-1 ">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5" />}
        <h1 className="text-4xl font-black tracking-tight">
          {title}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground/50 ml-8">
        {description}
      </p>
    </div>
  )
}