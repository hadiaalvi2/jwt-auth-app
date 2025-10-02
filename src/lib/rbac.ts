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
    console.error("GET /api/user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log("PATCH /api/user - Starting request")
    
    const session = await getServerSession(authOptions)
    console.log("Session:", session ? "Exists" : "Null", session?.user?.id)

    if (!session) {
      console.log("No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check write permissions
    const userRole = session.user.role as Role
    console.log("User role:", userRole)
    
    const hasWritePermission = hasPermission(userRole, Permission.WRITE_USER)
    console.log("Has WRITE_USER permission:", hasWritePermission)
    
    if (!hasWritePermission) {
      console.log("Insufficient permissions")
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    console.log("Request body:", body)
    
    const { name } = body

    if (!name || typeof name !== 'string') {
      console.log("Invalid name:", name)
      return NextResponse.json({ error: "Name is required and must be a string" }, { status: 400 })
    }

    console.log("Updating user:", session.user.id, "with name:", name)

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

    console.log("User updated successfully:", updatedUser)

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("PATCH /api/user error:", error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    
    return NextResponse.json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}