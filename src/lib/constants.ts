export const CATEGORY = {
  MOTORCYCLE: 'MOTORCYCLE',
  HELMET: 'HELMET',
  JACKET: 'JACKET',
  PANTS: 'PANTS',
  GLOVES: 'GLOVES',
  BOOTS: 'BOOTS',
  PARTS: 'PARTS',
  ACCESSORIES: 'ACCESSORIES',
} as const

export const LISTING_STATUS = {
  ACTIVE: 'ACTIVE',
  SOLD: 'SOLD',
  PENDING: 'PENDING',
} as const

export const CATEGORY_IMAGES: Record<keyof typeof CATEGORY, string> = {
  MOTORCYCLE: '/category-images/motorcycle.png',
  HELMET: '/category-images/helmet.png',
  JACKET: '/category-images/jacket.png',
  PANTS: '/category-images/pants.png',
  GLOVES: '/category-images/gloves.png',
  BOOTS: '/category-images/boots.png',
  PARTS: '/category-images/parts.png',
  ACCESSORIES: '/category-images/accessories.png',
}

export const CONDITION = {
  NEW: 'NEW',
  USED: 'USED',
} as const

export const LOCATION = {
  GAUTENG: 'GAUTENG',
  WESTERN_CAPE: 'WESTERN_CAPE',
  KWAZULU_NATAL: 'KWAZULU_NATAL',
  NORTH_WEST: 'NORTH_WEST',
  FREE_STATE: 'FREE_STATE',
  MPUMALANGA: 'MPUMALANGA',
  LIMPOPO: 'LIMPOPO',
  EASTERN_CAPE: 'EASTERN_CAPE',
  NORTHERN_CAPE: 'NORTHERN_CAPE',
} as const

export const SIZE = {
  XS: 'XS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  EU41_UK6: 'EU41_UK6',
  EU42_UK7: 'EU42_UK7',
  EU43_UK8: 'EU43_UK8',
  EU44_UK9: 'EU44_UK9',
  EU45_UK10: 'EU45_UK10',
  EU46_UK11: 'EU46_UK11',
  EU47_UK12: 'EU47_UK12',
} as const

export const TYPE = {
  ADVENTURE: 'ADVENTURE',
  HYPER_NAKED: 'HYPER_NAKED',
  NAKED: 'NAKED',
  SUPERSPORT: 'SUPERSPORT',
  SPORTS_TOURING: 'SPORTS_TOURING',
  DUAL_SPORT: 'DUAL_SPORT',
  ENDURO: 'ENDURO',
  SUPERMOTO: 'SUPERMOTO',
  SCRAMBLER: 'SCRAMBLER',
  SCOOTER: 'SCOOTER',
  OTHER: 'OTHER',
} as const

export const BRAND = {
  YAMAHA: 'YAMAHA',
  HONDA: 'HONDA',
  SUZUKI: 'SUZUKI',
  KAWASAKI: 'KAWASAKI',
  DUCATI: 'DUCATI',
  TRIUMPH: 'TRIUMPH',
  OTHER: 'OTHER',
  ALPINESTARS: 'ALPINESTARS',
  BERIK: 'BERIK',
  CARDO: 'CARDO',
  DJI: 'DJI',
  GAERNE: 'GAERNE',
  LS2: 'LS2',
  NOLAN: 'NOLAN',
  KYT: 'KYT',
  OXFORD: 'OXFORD',
  RST: 'RST',
  SCORPION: 'SCORPION',
  SHARK: 'SHARK',
  SHOEI: 'SHOEI',
  VYKON: 'VYKON',
  YOSHIMURA: 'YOSHIMURA',
} as const

export const MODEL = {

  // Yamaha
  YZF_R3: 'YZF_R3',
  YZF_R6: 'YZF_R6',
  YZF_R7: 'YZF_R7',
  YZF_R1: 'YZF_R1',
  MT_03: 'MT_03',
  MT_07: 'MT_07',
  MT_09: 'MT_09',
  MT_10: 'MT_10',
  XSR_700: 'XSR_700',
  XSR_900: 'XSR_900',
  TENERE_700: 'TENERE_700',
  TRACER_9: 'TRACER_9',

  // Honda
  CBR600RR: 'CBR600RR',
  CBR650R: 'CBR650R',
  CBR1000RR: 'CBR1000RR',
  FIREBLADE_SP: 'FIREBLADE_SP',
  CB650R: 'CB650R',
  GROM: 'GROM',

  // Kawasaki
  NINJA_400: 'NINJA_400',
  NINJA_500: 'NINJA_500',
  NINJA_650: 'NINJA_650',
  ZX4R: 'ZX4R',
  ZX6R: 'ZX6R',
  ZX10R: 'ZX10R',
  Z400: 'Z400',
  Z650: 'Z650',
  Z900: 'Z900',
  
  // Suzuki
  GSXR250: 'GSXR250',
  GSXR600: 'GSXR600',
  GSXR750: 'GSXR750',
  GSXR1000: 'GSXR1000',
  GSX8R: 'GSX8R',
  GSX8S: 'GSX8S',

  // Ducati
  PANIGALE_V2: 'PANIGALE_V2',
  PANIGALE_V4: 'PANIGALE_V4',
  STREETFIGHTER_V2: 'STREETFIGHTER_V2',
  STREETFIGHTER_V4: 'STREETFIGHTER_V4',
  MONSTER: 'MONSTER',
  SCRAMBLER_800: 'SCRAMBLER_800',
  MULTISTRADA_V4: 'MULTISTRADA_V4',
  DIAVEL: 'DIAVEL',
  HYPERMOTARD: 'HYPERMOTARD',

  // Triumph
  DAYTONA_675: 'DAYTONA_675',
  STREET_TRIPLE: 'STREET_TRIPLE',
  STREET_TRIPLE_765: 'STREET_TRIPLE_765',
  TRIDENT_660: 'TRIDENT_660',
  TIGER_900: 'TIGER_900',
  BONNEVILLE_T120: 'BONNEVILLE_T120',
  SCRAMBLER_900: 'SCRAMBLER_900'

} as const

// Brand-to-model mapping for motorcycles
export const BRAND_TO_MODELS: Record<string, string[]> = {
  YAMAHA: [
    'YZF_R3',
    'YZF_R6',
    'YZF_R7',
    'YZF_R1',
    'MT03',
    'MT07',
    'MT09',
    'MT10',
    'XSR700',
    'XSR900',
    'TENERE_700',
    'TRACER_9'
  ],
  HONDA: [
    'CBR600RR', 
    'CBR650R', 
    'CBR1000RR',
    'FIREBLADE_SP', 
    'CB650R', 
    'GROM'
  ],
  KAWASAKI: [
    'NINJA_400', 
    'NINJA_500', 
    'NINJA_650',
    'ZX4R', 
    'ZX6R', 
    'ZX10R', 
    'Z400', 
    'Z650', 
    'Z900'
  ],
  SUZUKI: [
    'GSXR250', 
    'GSXR600', 
    'GSXR750', 
    'GSXR1000', 
    'GSX8R', 
    'GSX8S'
  ],

  DUCATI: [
    'PANIGALE_V2', 
    'PANIGALE_V4', 
    'STREETFIGHTER_V2', 
    'STREETFIGHTER_V4',
    'MONSTER', 
    'SCRAMBLER_800', 
    'MULTISTRADA_V4', 
    'DIAVEL', 
    'HYPERMOTARD'
  ],
  TRIUMPH: [
    'DAYTONA_675', 
    'STREET_TRIPLE', 
    'STREET_TRIPLE_765', 
    'TRIDENT_660', 
    'TIGER_900',
    'BONNEVILLE_T120', 
    'SCRAMBLER_1200', 
    'ROCKET_3'
  ],

  OTHER: ['OTHER'],
}

// Model-to-type mapping for motorcycles
export const MODEL_TO_TYPE: Record<string, string> = {
  // Yamaha
  YZF_R3: 'SUPERSPORT',
  YZF_R6: 'SUPERSPORT',
  YZF_R7: 'SUPERSPORT',
  YZF_R1: 'SUPERSPORT',
  MT03: 'NAKED',
  MT07: 'NAKED',
  MT09: 'HYPER_NAKED',
  MT10: 'HYPER_NAKED',
  XSR700: 'NAKED',
  XSR900: 'NAKED',
  TENERE_700: 'ADVENTURE',
  TRACER_9: 'SPORTS_TOURING',

  // Honda
  CBR600RR: 'SUPERSPORT',
  CBR650R: 'SUPERSPORT',
  CBR1000RR: 'SUPERSPORT',
  FIREBLADE_SP: 'SUPERSPORT',
  CB650R: 'NAKED',
  GROM: 'SCOOTER',

  // Kawasaki
  NINJA_400: 'SUPERSPORT',
  NINJA_500: 'SUPERSPORT',
  NINJA_650: 'SUPERSPORT',
  ZX4R: 'SUPERSPORT',
  ZX6R: 'SUPERSPORT',
  ZX10R: 'SUPERSPORT',
  ZX14R: 'SUPERSPORT',
  Z400: 'NAKED',
  Z650: 'NAKED',
  Z900: 'NAKED',

  // Suzuki
  GSXR250: 'SUPERSPORT',
  GSXR600: 'SUPERSPORT',
  GSXR750: 'SUPERSPORT',
  GSXR1000: 'SUPERSPORT',
  GSX8R: 'SPORTS_TOURING',
  GSX8S: 'NAKED',

  // Ducati
  PANIGALE_V2: 'SUPERSPORT',
  PANIGALE_V4: 'SUPERSPORT',
  STREETFIGHTER_V2: 'HYPER_NAKED',
  STREETFIGHTER_V4: 'HYPER_NAKED',
  MONSTER: 'NAKED',
  SCRAMBLER_800: 'SCRAMBLER',
  MULTISTRADA_V4: 'ADVENTURE',
  DIAVEL: 'NAKED',
  HYPERMOTARD: 'SUPERMOTO',

  // Triumph
  DAYTONA_675: 'SUPERSPORT',
  STREET_TRIPLE: 'NAKED',
  STREET_TRIPLE_765: 'NAKED',
  TRIDENT_660: 'NAKED',
  TIGER_900: 'ADVENTURE',
  BONNEVILLE_T120: 'SCRAMBLER',
  SCRAMBLER_900: 'SCRAMBLER',

  // Other
  OTHER: 'OTHER',
}

// Category-to-brand mapping
export const CATEGORY_TO_BRANDS: Record<string, string[]> = {
  MOTORCYCLE: ['YAMAHA', 'HONDA', 'SUZUKI', 'KAWASAKI', 'DUCATI', 'TRIUMPH', 'OTHER'],
  HELMET: ['SHARK', 'ALPINESTARS', 'LS2'],
  JACKET: ['RST', 'ALPINESTARS'],
  PANTS: ['RST', 'ALPINESTARS'],
  GLOVES: ['RST', 'BERIK', 'ALPINESTARS'],
  BOOTS: ['RST', 'GAERNE', 'ALPINESTARS'],
  PARTS: ['YOSHIMURA', 'OTHER'],
  ACCESSORIES: ['CARDO', 'DJI', 'OXFORD', 'OTHER'],
}

export type Category = typeof CATEGORY[keyof typeof CATEGORY]
export type Condition = typeof CONDITION[keyof typeof CONDITION]
export type Location = typeof LOCATION[keyof typeof LOCATION]
export type Brand = typeof BRAND[keyof typeof BRAND]
export type Size = typeof SIZE[keyof typeof SIZE]
export type Type = typeof TYPE[keyof typeof TYPE]
export type Model = typeof MODEL[keyof typeof MODEL]
