export type AuthProvider = 'wechat' | 'email'

export interface AuthUser {
  id: string
  name: string
  email?: string
  avatarUrl?: string
  title?: string
  status?: string
}

export interface AuthSession {
  provider: AuthProvider
  accessToken: string
  expiresAt: number
  user: AuthUser
}
