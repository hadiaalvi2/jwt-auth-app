import jwt from "jsonwebtoken"

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  )
  
  const refreshToken = jwt.sign(
    { userId: payload.userId },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  )
  
  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
  } catch (error) {
    throw new Error("Invalid access token")
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string }
  } catch (error) {
    throw new Error("Invalid refresh token")
  }
}