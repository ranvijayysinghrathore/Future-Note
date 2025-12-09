import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string }
        })

        if (!admin || !admin.isActive) {
          return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!isValidPassword) {
          return null
        }

        // Update last login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  ],
  pages: {
    signIn: "/login-admin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
