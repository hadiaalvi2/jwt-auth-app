"use client"

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/guards/AuthGuard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  image?: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user')
        if (response.ok) {
          const data = await response.json()
          setUserData(data.user)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.name || 'Loading...'}</div>
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
                <Badge variant={userData?.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {userData?.role || 'Loading...'}
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
                {userData?.createdAt 
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : 'Loading...'
                }
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
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Name:</span>
                  <span>{userData?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{userData?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Role:</span>
                  <Badge variant={userData?.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {userData?.role}
                  </Badge>
                </div>
              </div>
            )}
            <div className="pt-4">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}