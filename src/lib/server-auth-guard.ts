import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { redirect } from "next/navigation"
import { Role, Permission, hasPermission } from "./rbac"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireRole(roles: Role[]) {
  const session = await requireAuth()
  const userRole = session.user.role as Role
  
  if (!roles.includes(userRole)) {
    redirect('/unauthorized')
  }
  
  return session
}

export async function requirePermission(permission: Permission) {
  const session = await requireAuth()
  const userRole = session.user.role as Role
  
  if (!hasPermission(userRole, permission)) {
    redirect('/unauthorized')
  }
  
  return session
}

export async function requirePermissions(permissions: Permission[]) {
  const session = await requireAuth()
  const userRole = session.user.role as Role
  
  const hasAllPermissions = permissions.every(permission => 
    hasPermission(userRole, permission)
  )
  
  if (!hasAllPermissions) {
    redirect('/unauthorized')
  }
  
  return session
}