import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  accent?: boolean
}

export function StatCard({ title, value, icon: Icon, accent = false }: StatCardProps) {
  return (
    <Card className={`p-4 ${accent ? 'bg-accent text-background' : 'bg-muted/50'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-bold ${accent ? 'text-background' : 'text-primary'}`}>{title}</CardTitle>
        <Icon className={`h-7 w-7 ${accent ? 'bg-accent text-background' : 'text-primary'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-extrabold tracking-tight ${accent ? 'bg-accent text-background' : 'text-primary'}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
