import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Navbar } from '@/components/navigation/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JWT Auth App',
  description: 'Next.js app with JWT authentication and RBAC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
