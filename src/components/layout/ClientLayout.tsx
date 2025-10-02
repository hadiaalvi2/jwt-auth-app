"use client"

import { AuthProvider } from '@/components/auth/AuthProvider'
import { Navbar } from '@/components/navigation/Navbar'

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}