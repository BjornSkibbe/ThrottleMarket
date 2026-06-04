"use client"

import ListingForm from "@/features/listings/components/listing-form"
import { useParams } from "next/navigation"

export default function EditListingPage() {
  const params = useParams()
  const listingId = params.id as string

  return <ListingForm mode="edit" listingId={listingId} />
}
