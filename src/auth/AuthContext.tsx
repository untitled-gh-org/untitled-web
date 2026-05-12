import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  fetchMe,
  performLogout,
  redirectToLogin,
  type User,
} from "./authService"

const REFRESH_RATIO = 0.8

interface AuthState {
  user: User | null
  loading: boolean
}

export interface AuthContextValue extends AuthState {
  login: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearRefreshTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const scheduleRefresh = useCallback((exp: number) => {
    clearRefreshTimer()
    const nowSec = Math.floor(Date.now() / 1000)
    const ttl = exp - nowSec
    if (ttl <= 0) return

    const delayMs = Math.floor(ttl * REFRESH_RATIO) * 1000

    timerRef.current = setTimeout(async () => {
      try {
        const user = await fetchMe()
        setState({ user, loading: false })
        scheduleRefresh(user.exp)
      } catch {
        setState({ user: null, loading: false })
      }
    }, delayMs)
  }, [])

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const user = await fetchMe()
        if (!cancelled) {
          setState({ user, loading: false })
          scheduleRefresh(user.exp)
        }
      } catch {
        if (!cancelled) setState({ user: null, loading: false })
      }
    })()

    return () => {
      cancelled = true
      clearRefreshTimer()
    }
  }, [scheduleRefresh])

  const login = async () => {
    redirectToLogin(import.meta.env.VITE_LOGIN_URL)
  }

  const logout = async () => {
    clearRefreshTimer()
    setState({ user: null, loading: false })
    await performLogout()
  }

  return (
    <AuthContext value={{ ...state, login, logout }}>{children}</AuthContext>
  )
}
