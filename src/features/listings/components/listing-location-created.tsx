import { MapPin, Calendar } from "lucide-react"
import { formatLocation } from "@/lib/formatters"
import { formatDistanceToNow } from "date-fns"
import { Location } from "@/types"

interface ListingLocationCreatedProps {
  location: Location
  createdAt: Date
  className?: string
}

export function ListingLocationCreated({ location, createdAt, className }: ListingLocationCreatedProps) {
  return (
    <div className={`flex gap-2 text-xs text-muted-foreground ${className || ''}`}>
      {/* 
        LOCATION 
      */}
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        <span className="text-xs text-left tracking-wide leading-5 text-foreground/50 font-semibold">{formatLocation(location)}</span>
      </div>
      {/* <span>•</span> */}
      {/* CREATED AT */}
      {/* <div className="flex items-center gap-1"> */}
        {/* <Calendar className="h-4 w-4" /> */}
        {/* <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div> */}
    </div>
  )
}
