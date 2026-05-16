import { Navigate } from 'react-router-dom'
import { CreateUserForm } from '@/components'
import { useUser } from '@/hooks/use-user'

export function CreateUserPage() {
  const { user } = useUser()

  if (!user || user.role !== 'admin') return <Navigate to="/" />

  return (
    <div className="mx-auto max-w-4xl">
      <CreateUserForm className="mx-auto w-sm" />
    </div>
  )
}
