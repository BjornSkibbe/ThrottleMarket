import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SellerInfoProps {
  name: string
  image?: string | null
}

export function SellerInfo({ name, image }: SellerInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Sold by</span>
      <Avatar size="lg">
        {image ? (
          <AvatarImage src={image} alt={name} />
        ) : null}
        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}
