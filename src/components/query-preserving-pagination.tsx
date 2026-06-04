"use client"

import { useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface QueryPreservingPaginationProps {
  pagination: PaginationMeta | null
  basePath?: string
}

function buildPageUrl(basePath: string, searchParams: URLSearchParams, page: number): string {
  const params = new URLSearchParams(searchParams.toString())
  if (page === 1) {
    params.delete("page")
  } else {
    params.set("page", String(page))
  }
  const qs = params.toString()
  return `${basePath}${qs ? `?${qs}` : ""}`
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []

  if (current <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push("ellipsis", total)
  } else if (current >= total - 2) {
    pages.push(1, "ellipsis")
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1, "ellipsis")
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push("ellipsis", total)
  }

  return pages
}

export function QueryPreservingPagination({ pagination, basePath = "/marketplace" }: QueryPreservingPaginationProps) {
  const searchParams = useSearchParams()

  if (!pagination || pagination.totalPages <= 1) {
    return null
  }

  const { page, totalPages, hasNext, hasPrev } = pagination
  const pages = getPageNumbers(page, totalPages)

  return (
    <Pagination className="mt-8 mb-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildPageUrl(basePath, searchParams, page - 1)}
            aria-disabled={!hasPrev}
            tabIndex={hasPrev ? undefined : -1}
            className={!hasPrev ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationEllipsis key={`ellipsis-${idx}`} />
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={buildPageUrl(basePath, searchParams, p)}
                isActive={p === page}
                className="rounded-full"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={buildPageUrl(basePath, searchParams, page + 1)}
            aria-disabled={!hasNext}
            tabIndex={hasNext ? undefined : -1}
            className={!hasNext ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
