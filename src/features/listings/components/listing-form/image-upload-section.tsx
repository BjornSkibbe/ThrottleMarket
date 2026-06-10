import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/features/listings/components/image-upload"
import { FORM_LABELS } from "@/lib/constants/form"
import { useListingFormContext } from "@/features/listings/contexts/listing-form-context"

export function ImageUploadSection() {
  const { imageUrls, setImageUrls } = useListingFormContext()

  return (
    <div className="space-y-4">
      <Label>{FORM_LABELS.images}</Label>
      <ImageUpload value={imageUrls} onChange={setImageUrls} />
    </div>
  )
}
