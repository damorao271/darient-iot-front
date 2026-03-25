export type UserRole = 'admin' | 'user'

export interface CurrentUser {
  id: string
  email: string
  role: UserRole
}
