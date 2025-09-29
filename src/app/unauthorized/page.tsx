import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Contact your administrator if you believe this is an error.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}