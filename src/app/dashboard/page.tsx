import { requireAuth } from '@/lib/server-auth-guard'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield } from 'lucide-react'
import { EditProfileDialog } from '@/components/auth/EditProfileDialog'

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      image: true
    }
  })
  
  return user
}

export default async function DashboardPage() {
  // Server-side auth check
  const session = await requireAuth()
  const userData = await getUserData(session.user.id)

  if (!userData) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.name}</div>
            <p className="text-xs text-muted-foreground">
              Your account information
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={userData.role === 'ADMIN' ? 'default' : 'secondary'}>
                {userData.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Your access level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(userData.createdAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Account creation date
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Your profile information and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              <span>{userData.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Role:</span>
              <Badge variant={userData.role === 'ADMIN' ? 'default' : 'secondary'}>
                {userData.role}
              </Badge>
            </div>
          </div>
          <div className="pt-4">
            <EditProfileDialog currentName={userData.name || ''} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}