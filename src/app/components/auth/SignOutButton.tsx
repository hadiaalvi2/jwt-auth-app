"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost"
}

export function SignOutButton({ variant = "outline" }: SignOutButtonProps) {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant={variant}
    >
      Sign Out
    </Button>
  )
}