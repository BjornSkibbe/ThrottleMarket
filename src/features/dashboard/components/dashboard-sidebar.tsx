"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Package, Heart, Eye, LogOut, PackageCheck, Plus, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { SidebarShell } from "@/components/sidebar-shell"
import { DashboardNavItem } from "@/components/dashboard-nav-item"
import type { LucideIcon } from "lucide-react"

interface DashboardSidebarProps {
  activeTab?: string
  activeListingsCount?: number
  soldListingsCount?: number
  favoritesCount?: number
  recentlyViewedCount?: number
}

interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

const MENU_ITEMS: MenuItem[] = [
  { id: "my-listings", label: "My Listings", icon: Package, href: "/marketplace-dashboard?tab=my-listings" },
  { id: "favorites", label: "Favorites", icon: Crown, href: "/marketplace-dashboard?tab=favorites" },
]

export function DashboardSidebar({
  activeTab = "my-listings",
  activeListingsCount = 0,
  soldListingsCount = 0,
  favoritesCount = 0,
  recentlyViewedCount = 0,
}: DashboardSidebarProps) {
  return (
    <SidebarShell
      icon={LayoutDashboard}
      title="Dashboard"
      description="Create, view, edit or delete your listings"
      contentClassName="flex flex-col flex-1"
    >
      <div className="flex flex-col flex-1">
        <div className="space-y-6 flex-1">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard title="Active" value={activeListingsCount} icon={Package} accent />
          <StatCard title="Sold" value={soldListingsCount} icon={PackageCheck} />
          <StatCard title="Favorites" value={favoritesCount} icon={Heart} />
          <StatCard title="Viewed" value={recentlyViewedCount} icon={Eye} />
        </div>

        <div className="space-y-2">
          {/* Navigation */}
          {MENU_ITEMS.map((item) => (
            <DashboardNavItem
              key={item.id}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
            />
          ))}
        </div>
      </div>

        <div className="space-y-2">
          {/* Create New Listing */}
        <Button
          asChild
          variant="default"
          size="lg"
          className="w-full justify-start gap-3"
        >
          <Link href="/listings/create">
            <Plus className="h-5 w-5" />
            Create a new listing
          </Link>
        </Button>
        {/* Sign Out */}
        <Button
          variant="secondary"
          size="lg"
          className="w-full justify-start gap-3"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </Button>
        </div>
      </div>
    </SidebarShell>
  )
}
