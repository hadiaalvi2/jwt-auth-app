export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: "USER" | "ADMIN" | "MODERATOR"
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  sessionToken: string
  userId: string
  expires: Date
}

export interface RefreshToken {
  id: string
  token: string
  userId: string
  expiresAt: Date
  createdAt: Date
}
