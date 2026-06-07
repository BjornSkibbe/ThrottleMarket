import 'server-only'
import { prisma } from '@/lib/prisma'

export async function getFeaturedListings() {
  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE', isFeatured: true },
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          location: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })

  return listings.map(listing => ({
    ...listing,
    price: Number(listing.price),
  }))
}
