import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ImageGallery } from "@/features/listings/components/image-gallery"
import { MotorcycleDetails } from "@/features/listings/components/motorcycle-details"
import { ManageListingButtons } from "@/features/listings/components/manage-listing-buttons"
import { ListingDetailsSingle } from "@/features/listings/components/listing-details-single"
import { auth } from "@/features/auth/lib/auth"

interface ListingDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params
  const session = await auth()
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          location: true,
        },
      },
      motorcycle: true,
    },
  })

  if (!listing) {
    notFound()
  }

  // Track recently viewed if user is logged in
  if (session?.user?.id) {
    try {
      await prisma.recentlyViewed.upsert({
        where: {
          userId_listingId: {
            userId: session.user.id,
            listingId: listing.id,
          },
        },
        update: {
          viewedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          listingId: listing.id,
          viewedAt: new Date(),
        },
      })
    } catch (error) {
      // Ignore errors for recently viewed tracking
    }
  }

  const isOwner = session?.user?.id === listing.sellerId

  return (
    <div className="px-3 sm:px-6 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 w-full gap-6 max-w-7xl mx-auto">
         
        {/* ImageGallery COMPONENT: Main image gallery with up to 4 thumbnails */}
        <div className="flex flex-col justify-center gap-4 lg:px-12 lg:min-h-[calc(100vh-64px)]">
          <ImageGallery 
            images={listing.images} 
          /> 
        </div>
        
        <div className="flex flex-col justify-center gap-12 lg:px-12 lg:min-h-[calc(100vh-64px)] py-8">
          {/* ListingDetailsSingle COMPONENT */}
          <ListingDetailsSingle
            condition={listing.condition}
            category={listing.category}
            brand={listing.brand}
            title={listing.title}
            description={listing.description}
            price={listing.price}
            size={listing.size}
            location={listing.location}
            createdAt={listing.createdAt}
            motorcycle={listing.motorcycle}
          />
          {/* 
            ManageListingButtons COMPONENT 
            Contact Seller Button or Edit/Delete Buttons if owner
            Add to favorites button + share button
          */}
          <ManageListingButtons
            listingId={listing.id}
            isOwner={isOwner}
            isAuthenticated={!!session?.user}
          />
          {/* 
            Motorcycle Details COMPONENT (if CATEGORY is MOTORCYCLE) 
            Brand + Model, Year, Mileage, Engine Size, Type
          */}
          {listing.motorcycle && (
            <MotorcycleDetails 
              brand={listing.brand} 
              motorcycle={listing.motorcycle} 
            />
          )}  
        </div>
      </div>
      {/* Related Listings */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> */}
          {/* Related listings would be fetched here */}
          {/* <p className="text-muted-foreground col-span-full">More listings coming soon...</p>
        </div>
      </div> */}
    </div>
  )
}
