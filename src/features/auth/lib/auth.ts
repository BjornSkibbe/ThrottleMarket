import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// NOTE: prisma and bcryptjs are imported INSIDE the authorize callback
// rather than at the top level. This ensures the auth config remains
// Edge Runtime compatible for use in Next.js middleware.

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Lazy-import Prisma and bcrypt to keep the auth module Edge-safe
        const { prisma } = await import("@/lib/prisma")
        const bcrypt = await import("bcryptjs")

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  // trustHost is intentionally NOT set.
  // Production deployments must set NEXTAUTH_URL (or AUTH_URL) for host verification.
  // See ENV_SETUP.md for configuration details.
})
