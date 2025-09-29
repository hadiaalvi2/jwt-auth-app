import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <LoginForm />
    </div>
  )
}