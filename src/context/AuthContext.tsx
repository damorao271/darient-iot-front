import { createContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import { queryKeys } from '../api/query-keys'
import type { CurrentUser } from '../types/auth.types'

export interface AuthContextValue {
  user: CurrentUser | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user = null, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.getMe,
    retry: false,
    staleTime: Infinity,
  })

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
