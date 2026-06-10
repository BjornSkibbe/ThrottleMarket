# ThrottleMarket

![CI](https://github.com/BjornSkibbe/ThrottleMarket/actions/workflows/ci.yml/badge.svg)

A modern full-stack motorcycle and riding gear marketplace built with Next.js, TypeScript, Tailwind CSS, and Prisma.

This is a side project I'm building for fun — a playground for trying out new ideas, sharpening my full-stack skills, and shipping features end-to-end.

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

- **Framework**: Next.js 15 (App Router)
- **React**: 19
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
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed data
│   └── migrations/           # Database migrations
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes (listings, auth, messaging, uploadthing)
│   │   ├── auth/             # Authentication pages (signin, signup, reset-password)
│   │   ├── listings/         # Listing detail & edit pages
│   │   ├── marketplace/      # Marketplace browsing page
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles & CSS variables
│   ├── components/           # Shared React components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-boundary.tsx
│   │   ├── providers.tsx
│   │   ├── unsaved-changes-dialog.tsx
│   │   ├── skeleton/         # Loading skeletons
│   │   └── form-fields/      # Reusable form field components
│   ├── features/             # Feature-based modules (vertical slices)
│   │   ├── auth/             # Auth hooks, components, forms
│   │   ├── dashboard/        # Dashboard page, sidebar, stats, tables
│   │   ├── home/             # Home page sections (hero, featured listings)
│   │   ├── listings/         # Listing form, cards, details, image upload
│   │   │   ├── components/
│   │   │   ├── contexts/     # Listing form context (React Context)
│   │   │   └── lib/          # Listing schema & validation
│   │   ├── marketplace/      # Filters, sorting, pagination
│   │   └── messaging/        # Chat window, conversation list, hooks
│   ├── hooks/                # Global React hooks
│   │   ├── use-listing-form.ts
│   │   ├── use-marketplace-filters.ts
│   │   ├── use-form-validation.ts
│   │   ├── use-debounce.ts
│   │   └── use-toast.ts
│   ├── lib/                  # Utility functions & services
│   │   ├── api/              # API client functions
│   │   ├── constants/        # App constants (brands, models, form labels)
│   │   ├── core/             # Core utilities
│   │   ├── dashboard/        # Dashboard helpers
│   │   ├── errors/           # Custom error classes
│   │   ├── logger/           # Pino logging setup
│   │   ├── middleware/       # Custom middleware
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── sanitize.ts       # Content sanitization
│   │   └── utils.ts          # General utilities
│   └── types/                # Global TypeScript types
│       └── index.ts
├── public/                   # Static assets (images, SVGs)
├── package.json
├── next.config.ts
└── tsconfig.json
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
- ✅ **OAuth Providers** — GitHub sign-in works for all users. Google is configured but in Google Testing mode (contact me to be added as a test user). Credentials managed via Vercel dashboard.

## Coming Soon

Features and improvements under consideration for future development:

### Discovery & Buyer Experience
- [ ] **Saved Searches with Alerts** — Notify users when new listings match their saved filters
- [ ] **Price Drop Notifications** — Alert users when a favorited listing's price decreases
- [ ] **Recently Viewed Section** — Surface previously viewed listings on the homepage and dashboard (data already tracked in Prisma)
- [ ] **Compare Listings** — Side-by-side spec comparison tool for evaluating multiple listings

### Trust & Transactions
- [ ] **Seller Ratings & Reviews** — Post-transaction review system for buyers
- [ ] **Verified Seller Badges** — ID/document verification for high-trust sellers
- [ ] **In-App Offers & Negotiation** — Buyers can submit offers; sellers accept, reject, or counter
- [ ] **Motorcycle History Reports** — VIN checks or service history attachments on listings

### Content & Listings
- [ ] **Video Uploads** — Walk-around videos alongside photos in listing galleries
- [ ] **Boost / Promoted Listings** — Pay to pin listings to the top of search results
- [ ] **Seller Analytics Dashboard** — Views, favorites, and message conversion rates per listing

### Platform & Quality of Life
- [ ] **Rate Limiting & Spam Prevention** — Daily listing caps per user with admin review dashboard
- [ ] **Push Notifications** — Browser and mobile alerts for messages, offers, and price drops
- [ ] **Dark Mode Toggle** — Persistent user preference across sessions
- [ ] **Admin Moderation Panel** — Reported listings, user bans, and content moderation queue

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
