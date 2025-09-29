"use client"

import { useSession } from "next-auth/react"
import { hasPermission, Role, Permission } from "@/lib/rbac"

interface RoleGuardProps {
  children: React.ReactNode
  permissions: Permission[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, permissions, fallback }: RoleGuardProps) {
  const { data: session } = useSession()

  if (!session) {
    return fallback || <div>Access denied</div>
  }

  const userRole = session.user.role as Role
  const hasAccess = permissions.some(permission => hasPermission(userRole, permission))

  if (!hasAccess) {
    return fallback || <div>Insufficient permissions</div>
  }

  return <>{children}</>
}