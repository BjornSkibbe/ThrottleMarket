import { Eye, Edit, Trash2 } from "lucide-react"

export const TABLE_HEADINGS = [
  "Image",
  "Title",
  "Price",
  "Status",
  "Conversations",
  "Views",
  "Created",
  "Actions",
] as const

export const STATUS_VARIANT_MAP = {
  ACTIVE: "active",
  SOLD: "sold",
  DRAFT: "draft",
} as const

export const LISTING_ACTIONS = [
  { label: "View", href: (id: string) => `/listings/${id}`, icon: Eye },
  { label: "Edit", href: (id: string) => `/listings/${id}/edit`, icon: Edit },
  { label: "Delete", href: (id: string) => `/listings/${id}/delete`, icon: Trash2 },
] as const
