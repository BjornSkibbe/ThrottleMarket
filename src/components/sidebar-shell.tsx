"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar"
import { PageTitle } from "./page-title"
import { cn } from "@/lib/utils"

interface SidebarShellProps {
  icon: LucideIcon
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  cardClassName?: string
  contentClassName?: string
  transparent?: boolean
}

export function SidebarShell({
  icon,
  title,
  description,
  children,
  className,
  cardClassName,
  contentClassName,
  transparent = false,
}: SidebarShellProps) {
  return (
    <Sidebar>
      <SidebarContent className={cn("px-6 pt-6", transparent && "bg-transparent", className)}>
        <Card
          className={cn(
            "bg-transparent gap-6 rounded-none overflow-y-auto [&::-webkit-scrollbar]:hidden",
            transparent ? "bg-transparent" : "min-h-[calc(100vh-70px)]",
            cardClassName
          )}
        >
          <CardHeader>
            <CardTitle>
              <PageTitle icon={icon} title={title} description={description} />
            </CardTitle>
          </CardHeader>
          <CardContent className={contentClassName}>
            {children}
          </CardContent>
        </Card>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
