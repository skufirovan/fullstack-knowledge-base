export type UserRole = 'admin' | 'user' | 'editor'

export interface User {
  id: string
  email: string
  role: UserRole
}
