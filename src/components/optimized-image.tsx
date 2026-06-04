/**
 * Optimized Image Component
 * 
 * Uses Next.js Image component with lazy loading, optimization, and proper fallback.
 * This improves performance by automatically optimizing images and lazy loading them.
 */

'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Handle image load error
  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false)
  }

  // If there's an error, show a fallback
  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-muted-foreground text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-muted animate-pulse ${className}`}
          style={fill ? {} : { width, height }}
        >
          <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        fill={fill}
        sizes={sizes}
        quality={quality}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  )
}
