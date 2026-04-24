import type { AuthSession } from './types'

const AUTH_SESSION_KEY = 'job-tracker-auth-session-v1'

export function loadAuthSession(): AuthSession | null {
 try {
 const raw = localStorage.getItem(AUTH_SESSION_KEY)
 if (!raw) return null
 const parsed = JSON.parse(raw) as Partial<AuthSession>
 if (!parsed || typeof parsed !== 'object') return null
 if (
 typeof parsed.accessToken !== 'string' ||
 typeof parsed.expiresAt !== 'number' ||
 !parsed.user ||
 typeof parsed.user.name !== 'string'
 ) {
 return null
 }
 return parsed as AuthSession
 } catch {
 return null
 }
}

export function saveAuthSession(session: AuthSession): void {
 localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

export function clearAuthSession(): void {
 localStorage.removeItem(AUTH_SESSION_KEY)
}
