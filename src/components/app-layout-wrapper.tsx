"use client"

import { usePathname } from "next/navigation"
import { Suspense } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarketplaceSidebar } from "@/features/marketplace/components/marketplace-sidebar"
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar"
import { MessagingSidebar } from "@/features/messaging/components/messaging-sidebar"
import { useSidebarContext } from "@/contexts/sidebar-props-context"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { sidebarProps, setSidebarProps } = useSidebarContext()

  const isMarketplace = pathname === "/marketplace"
  const isDashboard = pathname === "/marketplace-dashboard"
  const isMessaging = pathname === "/messaging"
  const isHomePage = pathname === "/"

  return (
    <SidebarProvider>
 
      {isMarketplace && (
        <Suspense>
          <MarketplaceSidebar {...sidebarProps} />
        </Suspense>
      )}
      {isDashboard && (
        <Suspense>
          <DashboardSidebar {...sidebarProps} />
        </Suspense>
      )}
      {isMessaging && (
        <Suspense>
          <MessagingSidebar
            selectedConversationId={sidebarProps?.selectedConversationId}
            onSelectConversation={(conversationId) =>
              setSidebarProps({
                selectedConversationId: conversationId,
              })
            }
          />
        </Suspense>
      )}
  
      <SidebarInset>
        <Navbar />

        {/* Main Content AREA */}
        {isHomePage ? (
          <div>{children}</div>
        ) : (
          <div className="w-full mx-auto pb-3 md:pb-6 my-auto sm:min-h-[calc(100vh-70px)]">
            {children}
          </div>
        )}

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}