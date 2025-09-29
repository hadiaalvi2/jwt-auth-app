import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to JWT Auth App
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A complete authentication system with NextAuth.js, JWT tokens, and role-based access control.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>🔐 Secure Authentication</CardTitle>
            <CardDescription>
              OAuth integration with Google and GitHub providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seamless sign-in experience with industry-standard OAuth providers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎫 JWT Tokens</CardTitle>
            <CardDescription>
              Access and refresh token management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Secure token-based authentication with automatic refresh capabilities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛡️ Role-Based Access</CardTitle>
            <CardDescription>
              Granular permissions and route protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fine-grained access control with user roles and permissions.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        {session ? (
          <>
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
            {session.user.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="outline" size="lg">Admin Panel</Button>
              </Link>
            )}
          </>
        ) : (
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  )
}