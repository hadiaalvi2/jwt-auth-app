export enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN"
}

export enum Permission {
  READ_USER = "read:user",
  WRITE_USER = "write:user",
  DELETE_USER = "delete:user",
  READ_ADMIN = "read:admin",
  WRITE_ADMIN = "write:admin",
  MODERATE_CONTENT = "moderate:content"
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_USER],
  [Role.MODERATOR]: [
    Permission.READ_USER,
    Permission.WRITE_USER,
    Permission.MODERATE_CONTENT
  ],
  [Role.ADMIN]: [
    Permission.READ_USER,
    Permission.WRITE_USER,
    Permission.DELETE_USER,
    Permission.READ_ADMIN,
    Permission.WRITE_ADMIN,
    Permission.MODERATE_CONTENT
  ]
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

export function canAccessRoute(userRole: Role, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    "/admin": [Permission.READ_ADMIN],
    "/admin/users": [Permission.WRITE_ADMIN],
    "/dashboard": [Permission.READ_USER],
    "/moderate": [Permission.MODERATE_CONTENT]
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // Public route

  return hasAnyPermission(userRole, requiredPermissions)
}