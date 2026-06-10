import { formatBrand, formatModel } from "@/lib/formatters"
import { STATUS_VARIANT_MAP } from "./constants"
import type { DashboardListing } from "./types"

export function getStatusVariant(status: string) {
  return (STATUS_VARIANT_MAP as Record<string, string>)[status] ?? "outline"
}

export function getDisplayTitle(listing: DashboardListing) {
  return listing.title || `${formatBrand(listing.brand)} ${formatModel(listing.motorcycle?.model || "")}`
}

export function getMainImage(listing: DashboardListing) {
  return listing.images?.[0] ?? null
}

export function formatPrice(price: number | null | undefined) {
  if (price == null) return "N/A"
  return `R ${price.toLocaleString("en-ZA")}`
}

export function formatDate(date: Date | null | undefined) {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-ZA")
}
