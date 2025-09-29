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

    // Check admin permissions
    if (!hasPermission(session.user.role as Role, Permission.READ_ADMIN)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get all users for admin
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            sessions: true
          }
        }
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
