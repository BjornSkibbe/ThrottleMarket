"use client"

import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Category } from "@/types"
import { formatCategory } from "@/lib/formatters"
import { CATEGORY, CATEGORY_IMAGES } from "@/lib/constants"

const categories: Category[] = Object.values(CATEGORY)

export function CategoryFilter() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  return (

    // Category Filter GRID
 
  <div className="flex gap-4 pb-6 px-3 sm:px-6 lg:justify-center w-auto max-w-full overflow-x-auto max-w-screen">
    {categories.map((category) => (
      <Link
        key={category}
        href={`/marketplace?category=${category}`}
        className="flex flex-col items-center gap-2 min-w-[90px] shrink-0 group"
      >
        <div
          className={`border-4 transition-colors duration-300 p-1 rounded-full ${
            currentCategory === category
              ? "border-accent"
              : "border-border hover:border-primary"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden">
            <Image
              src={CATEGORY_IMAGES[category as keyof typeof CATEGORY_IMAGES]}
              alt={formatCategory(category)}
              width={100}
              height={100}
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        <span
          className={`text-xs font-semibold transition-colors text-center ${
            currentCategory === category
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {formatCategory(category)}
        </span>
      </Link>
    ))}
  </div>

  )
}
