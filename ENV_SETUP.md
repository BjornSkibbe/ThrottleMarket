# Environment Variables Setup

Copy these variables to your `.env` file in the project root.

## Database

### Option 1: Supabase (Recommended)
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Option 2: Local PostgreSQL
```
DATABASE_URL="postgresql://user:password@localhost:5432/throttle_market?schema=public"
```

### Option 3: Other Cloud (Neon, Railway, etc.)
Use the connection string provided by your database provider.

## NextAuth.js
```
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## UploadThing
```
UPLOADTHING_TOKEN="your-uploadthing-token"
```

## Optional: OAuth Providers (if using Google, GitHub, etc.)
```
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Getting Started with Supabase

1. **Create a Supabase account** at https://supabase.com
2. **Create a new project**:
   - Click "New Project"
   - Choose a name (e.g., "throttle-market")
   - Set a database password (save this!)
   - Choose a region closest to you
   - Click "Create new project"
3. **Get your database URL**:
   - Go to your project dashboard
   - Click on "Settings" → "Database"
   - Scroll to "Connection string"
   - Copy the "URI" format
   - Replace `[YOUR-PASSWORD]` with your database password
4. **Update your `.env` file** with the Supabase DATABASE_URL
5. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```
6. **Push the schema to Supabase**:
   ```bash
   npx prisma db push
   ```
7. **Seed the database**:
   ```bash
   npm run seed
   ```

## Getting Started with Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb throttle_market
   ```
3. Update your `.env` file with your local connection string
4. Generate Prisma client and push schema (see steps 5-7 above)

## General Setup

1. Create a `.env` file in the project root
2. Copy the variables above and fill in your actual values
3. Get UploadThing credentials from https://uploadthing.com
4. Generate a random secret for NEXTAUTH_SECRET using: `openssl rand -base64 32`
