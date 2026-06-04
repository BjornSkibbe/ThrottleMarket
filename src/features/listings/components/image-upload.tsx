"use client"

import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            {value.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
                <ImageIcon className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No images uploaded yet</p>
                <p className="text-xs mt-1">Upload at least one image to continue</p>
              </div>
            ) : (
              value.map((url, index) => (
                <div
                  key={url}
                  className="relative group w-32 h-32 rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                >
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                    onClick={() => handleRemove(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {index + 1}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-col items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>{value.length} image{value.length !== 1 ? 's' : ''} uploaded</span>
              </div>
              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Upload complete:", res)
                  const newUrls = res.map((file) => file.url)
                  onChange([...value, ...newUrls])
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`)
                }}
                appearance={{
                  button: {
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: "700",
                  },
                  container: {
                    display: "flex",
                    alignItems: "center",
                  },
                }}
                config={{
                  mode: "auto",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
