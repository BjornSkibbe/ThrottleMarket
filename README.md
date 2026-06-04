# ThrottleMarket

![CI](https://github.com/BjornSkibbe/ThrottleMarket/actions/workflows/ci.yml/badge.svg)

A modern full-stack motorcycle and riding gear marketplace built with Next.js, TypeScript, Tailwind CSS, and Prisma.

**Live Demo:** [throttle-market.vercel.app](https://throttle-market.vercel.app)

## Features

- **User Authentication**: Secure sign-up and login with NextAuth.js
- **Marketplace Listings**: Create, browse, and manage listings for motorcycles and riding gear
- **Categories**: Motorcycles, Helmets, Jackets, Pants, Gloves, Boots, Parts, and Accessories
- **Advanced Search & Filters**: Filter by category, price range, location, condition, and more
- **Motorcycle-Specific Details**: Make, model, year, mileage, and engine size for motorcycle listings
- **User Dashboard**: Manage your listings, favorites, and recently viewed items
- **Image Gallery**: Multiple images per listing with fullscreen viewing
- **Premium Dark UI**: Modern, responsive design with glassmorphism effects

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Image Upload**: UploadThing
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase recommended, or local PostgreSQL, Neon, Railway)

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create your .env file with the following variables:

# For Supabase (recommended):
DATABASE_URL="postgresql://postgres.<project-ref>:PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Or for local PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost:5432/throttle_market?schema=public"

NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

**For Supabase setup:**
1. Create a free account at https://supabase.com
2. Create a new project (name it "throttle-market")
3. Go to Settings → Database → Connection string
4. Copy the URI format and replace `[YOUR-PASSWORD]` with your database password
5. Add the DATABASE_URL to your `.env` file

See `ENV_SETUP.md` for detailed database setup instructions.

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Set up the database:
```bash
# Push the schema to your database
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate dev --name init
```

6. Seed the database with sample data:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
throttle-market/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Seed data
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # User dashboard
│   │   ├── listings/         # Listing pages
│   │   ├── marketplace/      # Marketplace page
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── listing-card.tsx
│   │   ├── image-gallery.tsx
│   │   └── marketplace-filters.tsx
│   ├── lib/                  # Utility functions
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # Auth configuration
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript types
│       └── index.ts
├── ENV_SETUP.md              # Environment variables documentation
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Listing**: Marketplace listings with category-specific details
- **Image**: Images associated with listings
- **MotorcycleDetails**: Motorcycle-specific fields (make, model, year, mileage, engine size)
- **Favorite**: User's favorited listings
- **RecentlyViewed**: User's recently viewed listings
- **Account/Session**: NextAuth.js authentication models

## Authentication

The application uses NextAuth.js for authentication with credentials provider. Users can:
- Sign up with email and password
- Sign in with their credentials
- Access protected routes (dashboard, create listing)

## Implemented Features (Previously Planned)

These items were listed as future enhancements and are now fully built:

- ✅ **UploadThing** — Image uploads with drag-and-drop in listing forms
- ✅ **Messaging System** — Real-time conversations between buyers and sellers with optimistic UI
- ✅ **Loading Skeletons & Empty States** — `EmptyState` component plus skeletons for dashboard, cards, and detail views
- ✅ **Toast Notifications** — Feedback on every user action (create, update, delete, send message)
- ✅ **Edit Listing** — Full PATCH flow with ownership validation
- ✅ **Delete Listing** — Confirmation flow with optimistic removal and rollback
- ✅ **Pagination** — Server-side pagination with page/limit across listings and messages
- ✅ **Advanced Search & Filters** — Category, brand, type, price, location, condition with database-level aggregation
- ✅ **OAuth Providers** — Google and GitHub sign-in via NextAuth.js (configure credentials in Vercel dashboard)

## Coming Soon

- [ ] **Seller Ratings & Reviews** — Post-transaction review system for buyers

## What I Learned Building ThrottleMarket

Building this project taught me several lessons about shipping production-grade full-stack applications:

**Layered backend architecture wins.** Starting with direct Prisma calls in API routes quickly became unmaintainable. Moving to a Repository → Service → Route Handler pattern made testing trivial and let me swap data access strategies without touching business logic.

**Serverless breaks in-memory assumptions.** My initial rate limiter and CSRF store used `Map` objects that reset on every cold start. Migrating to Upstash Redis taught me to design for stateless execution from day one.

**Sanitize at the boundary, not the boundary.** I first tried escaping HTML in React components to prevent XSS, but realized service-layer sanitization (via `sanitizeContent`) is safer — it protects API consumers, RSS feeds, and any future clients automatically.

**Custom error hierarchies are worth the boilerplate.** Discriminated error classes (`DatabaseError`, `ValidationError`) with typed guards let the frontend show precise messages without fragile string matching. They also made my Vitest tests expressive and deterministic.

**Feature folders scale better than type folders.** When I needed to add "recently viewed" support, the vertical slice (`features/listings/`) meant I touched only 4 files in one directory instead of hunting across `components/`, `lib/`, and `hooks/`.

**Testing strategy matters.** Mocking Prisma at the repository layer gave me the best coverage-to-effort ratio. API route tests catch integration bugs; service tests catch business logic bugs; repository tests catch query bugs. I now have 95 tests across 12 files.

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

For other platforms, follow their deployment guides for Next.js applications.

## License

This project is for demonstration purposes.
