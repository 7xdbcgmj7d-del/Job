import type { AuthSession, AuthUser } from './types'

const OAUTH_STATE_KEY = 'job-tracker-oauth-state'
const AUTH_START_ENDPOINT = '/api/auth/start'
const AUTH_COMPLETE_ENDPOINT = '/api/auth/complete'
const AUTH_ME_ENDPOINT = '/api/auth/me'

function randomState(): string {
 if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
 return crypto.randomUUID()
 }
 return `state-${Date.now()}`
}

export function readOAuthState(): string | null {
 return sessionStorage.getItem(OAUTH_STATE_KEY)
}

export function clearOAuthState(): void {
 sessionStorage.removeItem(OAUTH_STATE_KEY)
}

export function saveOAuthState(state: string): void {
 sessionStorage.setItem(OAUTH_STATE_KEY, state)
}

export async function beginWechatLogin(): Promise<void> {
 const state = randomState()
 saveOAuthState(state)
 const response = await fetch(AUTH_START_ENDPOINT, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 provider: 'wechat',
 state,
 redirectUri: `${window.location.origin}/?auth_callback=1`,
 }),
 })
 if (!response.ok) {
 throw new Error('微信授权发起失败，请点击重试。')
 }
 const data = (await response.json()) as { redirectUrl?: string; state?: string }
 if (!data.redirectUrl) {
 throw new Error('登录服务暂不可用，请稍后重试。')
 }
 if (data.state) {
 saveOAuthState(data.state)
 }
 window.location.href = data.redirectUrl
}

export async function startEmailOtp(email: string): Promise<string> {
 const response = await fetch(AUTH_START_ENDPOINT, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 provider: 'email',
 email,
 }),
 })
 if (!response.ok) {
 throw new Error('验证码发送失败，请确认邮箱后重试。')
 }
 const data = (await response.json()) as { challengeId?: string; message?: string }
 if (!data.challengeId) {
 throw new Error(data.message || '验证码发送失败，请重试。')
 }
 return data.challengeId
}

function parseSession(data: {
 provider?: string
 accessToken?: string
 access_token?: string
 expiresAt?: number
 expires_at?: number
 expiresIn?: number
 expires_in?: number
 user?: Partial<AuthUser>
}): AuthSession {
 const token = data.accessToken ?? data.access_token
 if (!token) {
 throw new Error('登录未完成，请重新发起登录。')
 }
 const expiresAt =
 data.expiresAt ??
 data.expires_at ??
 (data.expiresIn ? Date.now() + data.expiresIn * 1000 : undefined) ??
 (data.expires_in ? Date.now() + data.expires_in * 1000 : undefined) ??
 Date.now() + 3600 * 1000
 return {
 provider: (data.provider as AuthSession['provider']) ?? 'email',
 accessToken: token,
 expiresAt,
 user: {
 id: data.user?.id ?? `u-${Date.now()}`,
 name: data.user?.name ?? '已登录用户',
 email: data.user?.email,
 avatarUrl: data.user?.avatarUrl,
 title: data.user?.title ?? '求职者',
 status: data.user?.status ?? '求职中',
 },
 }
}

export async function completeWechatAuth(args: {
 code: string
 state: string
}): Promise<AuthSession> {
 const expectedState = readOAuthState()
 if (!expectedState || expectedState !== args.state) {
 throw new Error('微信授权已超时或已失效，请点击重试登录。')
 }
 const response = await fetch(AUTH_COMPLETE_ENDPOINT, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 provider: 'wechat',
 code: args.code,
 state: args.state,
 }),
 })
 if (!response.ok) {
 throw new Error('微信登录失败，请返回后点击重试。')
 }
 const data = (await response.json()) as {
 provider?: string
 accessToken?: string
 access_token?: string
 expiresAt?: number
 expires_at?: number
 expiresIn?: number
 expires_in?: number
 user?: Partial<AuthUser>
 }
 clearOAuthState()
 return parseSession(data)
}

export async function completeEmailOtp(args: {
 challengeId: string
 otp: string
}): Promise<AuthSession> {
 const response = await fetch(AUTH_COMPLETE_ENDPOINT, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 provider: 'email',
 challengeId: args.challengeId,
 otp: args.otp,
 }),
 })
 if (!response.ok) {
 throw new Error('邮箱验证码不正确或已过期，请重新获取。')
 }
 const data = (await response.json()) as {
 provider?: string
 accessToken?: string
 access_token?: string
 expiresAt?: number
 expires_at?: number
 expiresIn?: number
 expires_in?: number
 user?: Partial<AuthUser>
 }
 return parseSession(data)
}

export async function fetchCurrentUser(session: AuthSession): Promise<AuthUser> {
 const response = await fetch(AUTH_ME_ENDPOINT, {
 headers: { Authorization: `Bearer ${session.accessToken}` },
 })
 if (!response.ok) return session.user
 const data = (await response.json()) as Partial<AuthUser>
 return {
 ...session.user,
 ...data,
 name: data.name ?? session.user.name,
 id: data.id ?? session.user.id,
 }
}
