import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "./db"
import { generateTokens, verifyRefreshToken } from "./jwt"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (dbUser) {
          const tokens = generateTokens({ 
            userId: dbUser.id, 
            email: dbUser.email,
            role: dbUser.role 
          })
          
          // Store refresh token in database
          await prisma.refreshToken.create({
            data: {
              token: tokens.refreshToken,
              userId: dbUser.id,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
          })
          
          token.accessToken = tokens.accessToken
          token.refreshToken = tokens.refreshToken
          token.role = dbUser.role
          token.userId = dbUser.id
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}