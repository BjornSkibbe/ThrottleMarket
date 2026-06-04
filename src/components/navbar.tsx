"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bike, LayoutDashboard, Plus, Store, ArrowLeft, LogIn, LogOut, MessageSquare, PanelLeft, Motorbike } from "lucide-react"
import { useMemo } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { useConversations } from "@/features/messaging/hooks"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { data: conversations } = useConversations()
  const { toggleSidebar } = useSidebar()

  const unreadCount = useMemo(
    () => conversations?.data?.reduce((total, conv) => total + (conv.unreadCount || 0), 0) || 0,
    [conversations]
  )

  const isListingPage = pathname.startsWith("/listings/")
  const isHomePage = pathname === "/"
  const isAuthPage = pathname.startsWith("/auth")
  const isMessagingPage = pathname.startsWith("/messaging")

  const leftSlot = useMemo(() => {
    if (isListingPage) {
      return (
        <Link href="/marketplace">
          <Button 
            size="icon-lg" 
            variant="ghost" 
            className="text-accent hover:text-accent">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
      )
    }
    if (isHomePage || isAuthPage) {
      return <div className="w-11" />
    }

    return (
      <Button
        size="icon-lg"
        variant="ghost"
        className="text-accent hover:text-accent relative"
        onClick={toggleSidebar}
      >
        {isMessagingPage ? (
          <>
            <MessageSquare className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive" />
            )}
          </>
        ) : (
          <PanelLeft className="h-6 w-6" />
        )}
      </Button>
    )
  }, [isListingPage, isMessagingPage, isHomePage, isAuthPage, toggleSidebar, unreadCount])

  return (
    <nav className="sticky top-0 z-50 h-16 w-full backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto px-4 w-full">
        <div className="grid grid-cols-3 h-16 items-center">
          {/* Sidebar trigger */}
          <div className="flex justify-start">
            {leftSlot}
          </div>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Motorbike className="h-8 w-8 text-accent" />
            <span className="text-xl font-extrabold tracking-tighter italic">
              ThrottleMarket
            </span>
          </Link>
          {/* Auth Buttons / User Menu */}
          <div className="flex justify-end items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 space-y-2 p-3 backdrop-blur supports-backdrop-filter:bg-background/95">
                  <div className="flex items-center justify-start gap-2 p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="py-3 space-y-3">
                    <DropdownMenuItem asChild>
                      <Link href="/marketplace-dashboard" className="flex flex-col p-6 h-fit text-xs">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/marketplace" className="flex flex-col p-6 h-fit text-xs">
                        <Store className="h-4 w-4" />
                        Marketplace
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messaging" className="relative flex flex-col p-6 h-fit text-xs">
                        <MessageSquare className="h-4 w-4" />
                        Messages
                        {unreadCount > 0 && (
                          <Badge variant="ghost" className="absolute top-2 right-2 ml-auto rounded-full w-5 h-5">
                            {unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="border-2 border-dashed">
                      <Link href="/listings/create" className="flex flex-col p-6 h-fit text-xs">
                        <Plus className="h-4 w-4" />
                        Create Listing
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-center w-full justify-center mt-3 text-xs"
                  >
                    <LogOut /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isAuthPage ? (
              <Link href="/auth/signin">
                <Button variant="ghost"><LogIn className="h-4 w-4" /><span className="hidden sm:inline">Login</span></Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
