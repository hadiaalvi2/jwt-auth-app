import { NextRequest, NextResponse } from "next/server"
import { verifyRefreshToken, generateTokens } from "@/lib/jwt"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 401 })
    }

    const decoded = verifyRefreshToken(refreshToken)
    
    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role
    })

    // Remove old refresh token and store new one
    await prisma.refreshToken.delete({ where: { id: storedToken.id } })
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: storedToken.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    return NextResponse.json({ 
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
  }
}
