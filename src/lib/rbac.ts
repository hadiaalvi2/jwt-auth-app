export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR"
}

export enum Permission {
  READ_USER = "READ_USER",
  WRITE_USER = "WRITE_USER",
  DELETE_USER = "DELETE_USER",
  READ_ADMIN = "READ_ADMIN",
  WRITE_ADMIN = "WRITE_ADMIN",
  READ_MODERATOR = "READ_MODERATOR",
  WRITE_MODERATOR = "WRITE_MODERATOR"
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.READ_USER,
    Permission.WRITE_USER
  ],
  [Role.MODERATOR]: [
    Permission.READ_USER,
    Permission.WRITE_USER,
    Permission.READ_MODERATOR,
    Permission.WRITE_MODERATOR
  ],
  [Role.ADMIN]: [
    Permission.READ_USER,
    Permission.WRITE_USER,
    Permission.DELETE_USER,
    Permission.READ_ADMIN,
    Permission.WRITE_ADMIN,
    Permission.READ_MODERATOR,
    Permission.WRITE_MODERATOR
  ]
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}