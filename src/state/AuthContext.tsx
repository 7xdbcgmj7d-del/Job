import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import {
 clearAuthSession,
 completeEmailOtp,
 completeWechatAuth,
 fetchCurrentUser,
 loadAuthSession,
 saveAuthSession,
 startEmailOtp,
 type AuthSession,
 type AuthUser,
} from '@/modules/auth'

interface AuthContextValue {
 user: AuthUser | null
 isAuthenticated: boolean
 isLoading: boolean
 startEmailLogin: (email: string) => Promise<string>
 verifyEmailCode: (challengeId: string, otp: string) => Promise<void>
 logout: () => void
 completeOAuthCallback: (code: string, state: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isExpired(session: AuthSession): boolean {
 return session.expiresAt <= Date.now()
}

export function AuthProvider({ children }: { children: ReactNode }) {
 const [session, setSession] = useState<AuthSession | null>(() => {
 const saved = loadAuthSession()
 if (!saved || isExpired(saved)) {
 clearAuthSession()
 return null
 }
 return saved
 })
 const [isLoading, setIsLoading] = useState(false)

 const startEmailLogin = useCallback(async (email: string) => {
 setIsLoading(true)
 try {
 return await startEmailOtp(email)
 } finally {
 setIsLoading(false)
 }
 }, [])

 const verifyEmailCode = useCallback(async (challengeId: string, otp: string) => {
 setIsLoading(true)
 try {
 const next = await completeEmailOtp({ challengeId, otp })
 const profile = await fetchCurrentUser(next)
 const sessionWithProfile: AuthSession = { ...next, user: profile }
 saveAuthSession(sessionWithProfile)
 setSession(sessionWithProfile)
 } finally {
 setIsLoading(false)
 }
 }, [])

 const logout = useCallback(() => {
 setSession(null)
 clearAuthSession()
 }, [])

 const completeOAuthCallback = useCallback(
 async (code: string, state: string) => {
 setIsLoading(true)
 try {
 const next = await completeWechatAuth({ code, state })
 const profile = await fetchCurrentUser(next)
 const sessionWithProfile: AuthSession = { ...next, user: profile }
 saveAuthSession(sessionWithProfile)
 setSession(sessionWithProfile)
 window.history.replaceState({}, '', '/')
 } finally {
 setIsLoading(false)
 }
 },
 []
 )

 const value = useMemo<AuthContextValue>(
 () => ({
 user: session?.user ?? null,
 isAuthenticated: Boolean(session && !isExpired(session)),
 isLoading,
 startEmailLogin,
 verifyEmailCode,
 logout,
 completeOAuthCallback,
 }),
 [
 session,
 isLoading,
 startEmailLogin,
 verifyEmailCode,
 logout,
 completeOAuthCallback,
 ]
 )

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
 const ctx = useContext(AuthContext)
 if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
 return ctx
}
