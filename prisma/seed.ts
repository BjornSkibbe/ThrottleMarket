
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up existing data
  console.log('Cleaning up existing data...')

  await prisma.conversationParticipant.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.image.deleteMany()
  await prisma.motorcycleDetails.deleteMany()
  await prisma.listing.deleteMany()

  console.log('Existing data cleaned up')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'demo1@example.com' },
    update: {},
    create: {
      email: 'demo1@example.com',
      name: 'Tyler Durden',
      password: hashedPassword,
      location: 'WESTERN_CAPE',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'demo2@example.com' },
    update: {},
    create: {
      email: 'demo2@example.com',
      name: 'Olivia Hartwell',
      password: hashedPassword,
      location: 'GAUTENG',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'demo3@example.com' },
    update: {},
    create: {
      email: 'demo3@example.com',
      name: 'Daniel Voss',
      password: hashedPassword,
      location: 'EASTERN_CAPE',
    },
  })

  console.log('Created users')

  // Create sample listings

  const motorcycle1 = await prisma.listing.create({
    data: {
      title: '2026 Yamaha YZF-R9',
      description:
        "The R9 takes proven race-derived technology and combines it with the critically acclaimed, triple cylinder engine platform which has revolutionised the Yamaha brand over the last decade. The marriage of this famously high-torque powerplant and Yamaha's renowned race-precision handling creates a perfectly balanced Supersport model worthy of its status as the R Series flagship.",
      category: 'MOTORCYCLE',
      brand: 'YAMAHA',
      price: 285000,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,

      images: {
        create: [
          {
            url: '/motorcycle-images/YAMAHA-YZF-R9_1.png',
            order: 0,
          },
          {
            url: '/motorcycle-images/YAMAHA-YZF-R9_2.png',
            order: 1,
          },
        ],
      },

      motorcycle: {
        create: {
          model: 'YZF_R9',
          type: 'SUPERSPORT',
          year: 2026,
          mileage: 0,
          engineSize: 890,
        },
      },
    },
  })

  const motorcycle2 = await prisma.listing.create({
    data: {
      title: '2026 Yamaha YZF-R7',
      description:
        "Yamaha's proven 689cc liquid-cooled, inline 2-cylinder DOHC fuel-injected CP2 engine delivers excellent power and performance throughout the rpm range for an exhilarating ride and a true supersport experience. Its 270-degree crankshaft delivers linear torque for exciting acceleration and limited vibration.",
      category: 'MOTORCYCLE',
      brand: 'YAMAHA',
      price: 189950,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,

      images: {
        create: [
          {
            url: '/motorcycle-images/YAMAHA-YZF-R7_1.png',
            order: 0,
          },
          {
            url: '/motorcycle-images/YAMAHA-YZF-R7_2.png',
            order: 1,
          },
        ],
      },

      motorcycle: {
        create: {
          model: 'YZF_R7',
          type: 'SUPERSPORT',
          year: 2026,
          mileage: 0,
          engineSize: 689,
        },
      },
    },
  })

  await prisma.listing.create({
    data: {
      title: '2026 Yamaha YZF-R3',
      description:
        'Featuring flowing bodywork and ergonomics inspired by the MotoGP® YZR-M1®, complemented by new colors and graphics, the YZF-R3® is sleek, aerodynamic and refined.',
      category: 'MOTORCYCLE',
      brand: 'YAMAHA',
      price: 129950,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,

      images: {
        create: [
          {
            url: '/motorcycle-images/YAMAHA-YZF-R3_1.png',
            order: 0,
          },
          {
            url: '/motorcycle-images/YAMAHA-YZF-R3_2.png',
            order: 1,
          },
        ],
      },

      motorcycle: {
        create: {
          model: 'STREET_TRIPLE_765',
          type: 'HYPER_NAKED',
          year: 2023,
          mileage: 8000,
          engineSize: 765,
        },
      },
    },
  })

  await prisma.listing.create({
    data: {
      title: '2026 Yamaha MT-07',
      description:
        'The latest MT-07 features radially mounted front brake calipers, inverted forks and lightweight SpinForged wheels.',
      category: 'MOTORCYCLE',
      brand: 'YAMAHA',
      price: 189500,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user3.id,

      images: {
        create: [
          {
            url: '/motorcycle-images/YAMAHA_MT07_1.png',
            order: 0,
          },
          {
            url: '/motorcycle-images/YAMAHA_MT07_2.png',
            order: 1,
          },
          {
            url: '/motorcycle-images/YAMAHA_MT07_3.png',
            order: 2,
          },
          {
            url: '/motorcycle-images/YAMAHA_MT07_4.png',
            order: 3,
          },
        ],
      },

      motorcycle: {
        create: {
          model: 'MT07',
          type: 'HYPER_NAKED',
          year: 2021,
          mileage: 7500,
          engineSize: 689,
        },
      },
    },
  })

  const helmetListing = await prisma.listing.create({
    data: {
      title: 'Shark D-Skwal 3 Dark Shadow Edition',
      description:
        'In the darkness, where the invisible and the untamable mingle, the D-Skwal 3 comes to life.',
      category: 'HELMET',
      brand: 'SHARK',
      size: 'M',
      price: 5499,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,

      images: {
        create: [
          {
            url: '/listing-images/SHARK_D-SKWAL_3_1.png',
            order: 0,
          },
          {
            url: '/listing-images/SHARK_D-SKWAL_3_2.png',
            order: 1,
          },
          {
            url: '/listing-images/SHARK_D-SKWAL_3_3.png',
            order: 2,
          },
        ],
      },
    },
  })

  await prisma.listing.create({
    data: {
      title: 'RST S-1 Leather CE',
      description: 'The perfect addition to the S1 Jacket, the S-1 CE Men’s Leather Jeans are equipped with removable knee sliders and a 360-degree connecting zip. Available in different leg lengths, these jeans are designed for both road and track use. Experience unparalleled comfort and protection with this high-performance gear.',
      category: 'PANTS',
      brand: 'RST',
      size: 'S',
      price: 5899,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/RST_S1_PANTS_1.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'RST S-1 Mesh D3O Textile',
      description: 'Geared towards summer riding and based on the fantastic S-1 textile jacket, this jacket uses the same chassis as its non-mesh S-1 counterpart but equipped with a mesh layer to allow air flow around the body. Paired with a removable water-resistant lining on the inside, this jacket is both practical and versatile in equal measure. Now equipped with D3O armour.',
      category: 'JACKET',
      brand: 'RST',
      size: 'XS',
      price: 5499,
      condition: 'NEW',
      location: 'GAUTENG',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/RST_S1_MESH_D3O_TEXTILE_JACKET_1.png', order: 0 },
        ],
      },
    },
  })

  await prisma.listing.create({
    data: {
      title: 'Cardo Packtalk Neo',
      description: 'Offering all the great technology of PACKTALK EDGE at a cut-down price. Including IP67 Waterproof, Dynamic MESH Communication, Sound by JBL, and Natural Voice Operation.',
      category: 'ACCESSORIES',
      brand: 'CARDO',
      price: 5999,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/CARDO_NEO.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'Cardo Freecom 4X',
      description: 'Everything you ever wanted from a Bluetooth® communicator, in one slick compact unit. From Natural Voice Operation allowing hands-free activation, to powerful Sound by JBL audio system, the FREECOM 4X is your hassle-free ticket to staying in sync on every journey.',
      category: 'ACCESSORIES',
      brand: 'CARDO',
      price: 3999,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/CARDO_FREECOM_4X.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'LS2 FF807 Dragon Carbon Matt',
      description: 'Discover the Dragon Helmet, the perfect combination of lightness and strength. Made of 6K carbon, this sport-touring helmet is ideal for everyday use and for your weekend rides. Protection, comfort and performance in one helmet, choose Dragon and take your experience to the limit!',
      category: 'HELMET',
      brand: 'LS2',
      price: 5700,
      size: 'M',
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/LS2_FF807_DRAGON_CM_1.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'LS2 FF807 Dragon Enthum Silver',
      description: 'Discover the Dragon Helmet, the perfect combination of lightness and strength. Made of 6K carbon, this sport-touring helmet is ideal for everyday use and for your weekend rides. Protection, comfort and performance in one helmet, choose Dragon and take your experience to the limit!',
      category: 'HELMET',
      brand: 'LS2',
      price: 5700,
      size: 'M',
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/LS2_FF807_DRAGON_ENTHUM_1.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'DJI Osmo Action 5 Pro Adventure Combo',
      description: ' ',
      category: 'ACCESSORIES',
      brand: 'DJI',
      price: 10995,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/DJI_OSMO_ACTION_5_PRO_ADVENTURE_COMBO_1.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
    data: {
      title: 'DJI Osmo Action 5 Pro Standard Combo',
      description: ' ',
      category: 'ACCESSORIES',
      brand: 'DJI',
      price: 8895,
      condition: 'NEW',
      location: 'WESTERN_CAPE',
      status: 'ACTIVE',
      sellerId: user1.id,
      images: {
        create: [
          { url: '/listing-images/DJI_OSMO_ACTION_5_PRO_STANDARD_COMBO_1.png', order: 0 },
        ],
      },
    },
  })
  await prisma.listing.create({
  data: {
    title: 'Gaerne GP1 Evo',
    description: `The GP1 EVO racing boots epitomize over sixty years of Italian excellence and passion in the thrilling world of racing. Representing the pinnacle of the Racing line, the GP1 EVO motorcycle boot is the result of collaboration between Gaerne's R&D and professional riders, standing as a testament to the company’s commitment to innovation and performance.`,
    category: 'BOOTS',
    brand: 'GAERNE',
    price: 9899,
    size: 'EU43_UK8',
    condition: 'NEW',
    location: 'WESTERN_CAPE',
    status: 'ACTIVE',
    sellerId: user1.id,
    images: {
      create: [
        {
          url: '/listing-images/GAERNE_GP1_EVO_WBY_1.png', order: 0,
        },
        {
          url: '/listing-images/GAERNE_GP1_EVO_WBY_2.png', order: 1,
        },
        {
          url: '/listing-images/GAERNE_GP1_EVO_WBY_3.png', order: 2,
        },
        {
          url: '/listing-images/GAERNE_GP1_EVO_WBY_4.png', order: 3,
        },
        
      ],
    },
  },
})
await prisma.listing.create({
  data: {
    title: 'Alpinestars SMX Plus V2',
    description: 'The SMX Plus v2 Boot perfectly blends sleek sports styling with advanced protection features developed in Alpinestars performance footwear department. The durable and light microfiber upper is reinforced with a rugged polymer protector and the exclusive Multi-Link Control (MLC) system prevents ankle torsion while offering freedom of movement.',
    category: 'BOOTS',
    brand: 'ALPINESTARS',
    price: 9300,
    size: 'EU43_UK8',
    condition: 'NEW',
    location: 'WESTERN_CAPE',
    status: 'ACTIVE',
    sellerId: user1.id,
    images: {
      create: [
        { url: '/listing-images/ALPINESTARS_SMX_PLUS_BLACK_1.png', order: 0 },
      ],
    },
  },
})
await prisma.listing.create({
  data: {
    title: 'Alpinestars SP3',
    description: 'Derived from Alpinestars involvement in top-level racing, the long cuff, SP-3 Gloves are packed with many race-inspired performance features. Accordion panels on the thumb and finger bridge enhance flexibility and control, while the pre-curved construction ensures a natural, ergonomic fit to reduce hand fatigue and improve freedom of movement. Constructed from full goat leather with padded reinforcements, these gloves deliver exceptional durability and abrasion resistance, ensuring lasting comfort and protection for the road.',
    category: 'GLOVES',
    brand: 'ALPINESTARS',
    price: 1995,
    size: 'M',
    condition: 'NEW',
    location: 'WESTERN_CAPE',
    status: 'ACTIVE',
    sellerId: user1.id,
    images: {
      create: [
        { url: '/listing-images/ALPINESTARS_SP3_GLOVES_1.png', order: 0 },
      ],
    },
  },
})


  console.log('Created listings')

  // Create favorites

  await prisma.favorite.create({
    data: {
      userId: user1.id,
      listingId: motorcycle2.id,
    },
  })

  console.log('Created favorites')

  // Create conversations + messages

  await prisma.conversation.create({
    data: {
      listingId: motorcycle2.id,
      buyerId: user1.id,
      sellerId: user2.id,
      lastMessage: 'Cool. Can I come view it this weekend?',
      lastMessageAt: new Date(),

      participants: {
        create: [
          {
            userId: user1.id,
            unreadCount: 0,
          },
          {
            userId: user2.id,
            unreadCount: 1,
          },
        ],
      },

      messages: {
        create: [
          {
            senderId: user1.id,
            content: 'Hey man, is the Street Triple still available?',
          },
          {
            senderId: user2.id,
            content: 'Hi, yes it is 👍',
          },
          {
            senderId: user1.id,
            content: 'Awesome. Has it ever been dropped?',
          },
          {
            senderId: user2.id,
            content: 'Never dropped. Full service history available.',
          },
          {
            senderId: user1.id,
            content: 'Cool. Can I come view it this weekend?',
          },
        ],
      },
    },
  })

  await prisma.conversation.create({
    data: {
      listingId: motorcycle1.id,
      buyerId: user2.id,
      sellerId: user1.id,
      lastMessage: 'Would you take R118k?',
      lastMessageAt: new Date(),

      participants: {
        create: [
          {
            userId: user1.id,
            unreadCount: 1,
          },
          {
            userId: user2.id,
            unreadCount: 0,
          },
        ],
      },

      messages: {
        create: [
          {
            senderId: user2.id,
            content: 'This CBR is beautiful.',
          },
          {
            senderId: user1.id,
            content: 'Thanks! It is in immaculate condition.',
          },
          {
            senderId: user2.id,
            content: 'Any room to negotiate on price?',
          },
          {
            senderId: user1.id,
            content: 'Slightly, depending on how serious you are.',
          },
          {
            senderId: user2.id,
            content: 'Would you take R118k?',
          },
        ],
      },
    },
  })

  await prisma.conversation.create({
    data: {
      listingId: helmetListing.id,
      buyerId: user2.id,
      sellerId: user1.id,
      lastMessage: 'I’ll take it 👍',
      lastMessageAt: new Date(),

      participants: {
        create: [
          {
            userId: user1.id,
            unreadCount: 0,
          },
          {
            userId: user2.id,
            unreadCount: 0,
          },
        ],
      },

      messages: {
        create: [
          {
            senderId: user2.id,
            content: 'Hi, what size is the helmet?',
          },
          {
            senderId: user1.id,
            content: 'It is a medium.',
          },
          {
            senderId: user2.id,
            content: 'Perfect. Is the price negotiable?',
          },
          {
            senderId: user1.id,
            content: 'I can maybe drop slightly.',
          },
          {
            senderId: user2.id,
            content: 'I’ll take it 👍',
          },
        ],
      },
    },
  })

  console.log('Created conversations and messages')

  console.log('Seed completed successfully!')
}



main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
