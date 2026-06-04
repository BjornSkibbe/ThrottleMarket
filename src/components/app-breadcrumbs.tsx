"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FaHome } from "react-icons/fa"

// Define route mappings for custom breadcrumb labels
const routeLabels: Record<string, string> = {
  "": "Home",
  "marketplace": "Marketplace",
  "marketplace-dashboard": "Marketplace Dashboard",
  "auth": "Authentication",
  "listings": "Listings",
  "signin": "Sign In",
  "signup": "Sign Up",
}

export function AppBreadcrumbs() {
  const pathname = usePathname()
  const [listingTitle, setListingTitle] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Split pathname into segments
  const segments = pathname.split("/").filter(Boolean)
  
  // Check if we're on a listing page
  const isListingPage = segments[0] === "listings" && segments.length === 2
  const listingId = isListingPage ? segments[1] : null
  
  // Fetch listing title when on a listing page
  useEffect(() => {
    if (isListingPage && listingId) {
      setIsLoading(true)
      fetch(`/api/listings/${listingId}`)
        .then(res => res.json())
        .then(data => {
          if (data.title) {
            setListingTitle(data.title)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    } else {
      setListingTitle(null)
    }
  }, [isListingPage, listingId])
  
  // If no segments, show Home
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const isLast = index === segments.length - 1
    let label = routeLabels[segment] || segment
    
    // Use fetched listing title for the last segment if on a listing page
    if (isLast && isListingPage && listingTitle) {
      label = listingTitle
    } else if (isLast && isListingPage && isLoading) {
      label = "Loading..."
    }

    return {
      href,
      label,
      isLast,
    }
  })

  return (
    <Breadcrumb className="ml-4">
      <BreadcrumbList>
        {/* 
          Add Home as first breadcrumb 
        */}
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href="/"><FaHome /></Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* 
          Add breadcrumb items 
        */}
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <BreadcrumbSeparator className="hidden md:block px-2" />
            <BreadcrumbItem className={item.isLast ? "" : "hidden md:block"}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
