"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive?: boolean
}

export function DashboardNavItem({
  href,
  icon: Icon,
  label,
  isActive = false,
}: DashboardNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/5 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </Link>
  )
}
