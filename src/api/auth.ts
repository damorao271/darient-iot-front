import { client } from './client'
import type { CurrentUser } from '../types/auth.types'

export const authApi = {
  getMe: () => client.get<CurrentUser>('/auth/me'),
}
