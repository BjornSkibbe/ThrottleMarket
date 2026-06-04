import { Category, Condition, Location, ListingStatus, Size, Type } from '@prisma/client'

export function formatLocation(location: string): string {
  const locationMap: Record<string, string> = {
    GAUTENG: 'Gauteng',
    WESTERN_CAPE: 'Western Cape',
    KWAZULU_NATAL: 'KwaZulu Natal',
    NORTH_WEST: 'North West',
    FREE_STATE: 'Free State',
    MPUMALANGA: 'Mpumalanga',
    LIMPOPO: 'Limpopo',
    EASTERN_CAPE: 'Eastern Cape',
    NORTHERN_CAPE: 'Northern Cape',
  }
  return locationMap[location] || location
}

export function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    MOTORCYCLE: 'Motorcycle',
    HELMET: 'Helmet',
    JACKET: 'Jacket',
    PANTS: 'Pants',
    GLOVES: 'Gloves',
    BOOTS: 'Boots',
    PARTS: 'Parts',
    ACCESSORIES: 'Accessories',
  }
  return categoryMap[category] || category
}

export function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    NEW: 'New',
    USED: 'Used',
  }
  return conditionMap[condition] || condition
}

export function formatListingStatus(status: ListingStatus): string {
  const statusMap: Record<ListingStatus, string> = {
    ACTIVE: 'Active',
    SOLD: 'Sold',
    PENDING: 'Pending',
    DRAFT: 'Draft',
  }
  return statusMap[status] || status
}

export function formatSize(size: Size | null): string {
  if (!size) return ''
  const sizeMap: Record<Size, string> = {
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: 'XXL',
    EU41_UK6: 'EU41/UK6',
    EU42_UK7: 'EU42/UK7',
    EU43_UK8: 'EU43/UK8',
    EU44_UK9: 'EU44/UK9',
    EU45_UK10: 'EU45/UK10',
    EU46_UK11: 'EU46/UK11',
    EU47_UK12: 'EU47/UK12',
  }
  return sizeMap[size] || size
}

export function formatType(type: string): string {
  const typeMap: Record<string, string> = {
    HYPER_NAKED: 'Hyper Naked',
    SUPERSPORT: 'Supersport',
    SPORTS_TOURING: 'Sports Touring',
    ADVENTURE: 'Adventure',
    NAKED: 'Naked',
    DUAL_SPORT: 'Dual Sport',
    ENDURO: 'Enduro',
    SUPERMOTO: 'Supermoto',
    SCRAMBLER: 'Scrambler',
    SCOOTER: 'Scooter',
    OTHER: 'Other',
  }
  return typeMap[type] || type
}

export function formatBrand(brand: string): string {
  const brandMap: Record<string, string> = {
    YAMAHA: 'Yamaha',
    HONDA: 'Honda',
    KAWASAKI: 'Kawasaki',
    SUZUKI: 'Suzuki',
    DUCATI: 'Ducati',
    TRIUMPH: 'Triumph',
    OTHER: 'Other',
    SHARK: 'Shark',
    CARDO: 'Cardo',
    DJI: 'DJI',
    ALPINESTARS: 'Alpinestars',
    LS2: 'LS2',
    RST: 'RST',
  }
  return brandMap[brand] || brand
}

export function formatModel(model: string): string {
  const modelMap: Record<string, string> = {
    YZF_R1: 'YZF-R1',
    YZF_R6: 'YZF-R6',
    YZF_R7: 'YZF-R7',
    YZF_R3: 'YZF-R3',
    MT03: 'MT-03',
    MT07: 'MT-07',
    MT09: 'MT-09',
    MT10: 'MT-10',
    XSR700: 'XSR700',
    XSR900: 'XSR900',
    TENERE_700: 'Tenere700',
    TENERE_900: 'Tenere900',
    TENERE_1500: 'Tenere1500',
    STREET_TRIPLE_765: 'Street Triple 765',
    DAYTONA_675: 'Daytona675',
    GSXR750: 'GSXR750',
    GSXR600: 'GSXR600',
    DUKE_390: 'Duke390',
    ZX10R: 'ZX10R',
    // Add more mappings as needed
  }
  return modelMap[model] || model
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SOLD: 'Sold',
    EXPIRED: 'Expired',
  }
  return statusMap[status] || status
}

export function formatPrice(price: number): string {
  return `R${price.toLocaleString('en-ZA')}`
}

export function formatMileage(mileage: number | null): string | null {
  if (mileage === null) return null
  return `${mileage.toLocaleString('en-ZA')}km`
}

export function formatEngineSize(engineSize: number | null): string | null {
  if (engineSize === null) return null
  return `${engineSize}cc`
}