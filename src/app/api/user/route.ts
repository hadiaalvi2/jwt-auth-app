import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hasPermission, Role, Permission } from "@/lib/rbac"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user permissions
    if (!hasPermission(session.user.role as Role, Permission.READ_USER)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get current user's data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check write permissions
    if (!hasPermission(session.user.role as Role, Permission.WRITE_USER)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { name } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}