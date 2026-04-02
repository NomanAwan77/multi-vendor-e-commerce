import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as authApi from '../api/auth.api'
import type { User, UserRole } from '../types/models'

const STORAGE_KEY = 'mv_ecommerce_user'

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

interface AuthContextValue {
  user: User | null
  setUser: (u: User | null) => void
  login: (email: string, password: string) => Promise<void>
  register: (payload: authApi.RegisterBody) => Promise<void>
  logout: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => loadStoredUser())

  const persist = useCallback((u: User | null) => {
    setUserState(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password })
      persist(res.user)
    },
    [persist],
  )

  const register = useCallback(
    async (payload: authApi.RegisterBody) => {
      const res = await authApi.register(payload)
      persist(res.user)
    },
    [persist],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      persist(null)
    }
  }, [persist])

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      setUser: persist,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, persist, login, register, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
