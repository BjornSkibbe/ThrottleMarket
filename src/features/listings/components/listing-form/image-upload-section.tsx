import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/features/listings/components/image-upload"
import { FORM_LABELS } from "@/lib/constants/form"

interface ImageUploadSectionProps {
  imageUrls: string[]
  setImageUrls: (urls: string[]) => void
}

export function ImageUploadSection({ imageUrls, setImageUrls }: ImageUploadSectionProps) {
  return (
    <div className="space-y-4">
      <Label>{FORM_LABELS.images}</Label>
      <ImageUpload value={imageUrls} onChange={setImageUrls} />
    </div>
  )
}
