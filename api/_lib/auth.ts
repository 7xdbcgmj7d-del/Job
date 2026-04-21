import crypto from 'node:crypto'

import jwt from 'jsonwebtoken'

import { getJwtSecret } from './config.js'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7
const OTP_TTL_MS = 1000 * 60 * 10

export interface AccessTokenPayload {
  sub: string
  email: string
}

export function nowMs(): number {
  return Date.now()
}

export function accessTokenExpiresAtMs(): number {
  return nowMs() + TOKEN_TTL_MS
}

export function otpExpiresAtMs(): number {
  return nowMs() + OTP_TTL_MS
}

export function generateChallengeId(): string {
  return `chlg_${crypto.randomBytes(12).toString('hex')}`
}

export function generateOtpCode(): string {
  return `${crypto.randomInt(0, 1_000_000)}`.padStart(6, '0')
}

export function hashString(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function hashOtp(challengeId: string, otp: string): string {
  return hashString(`${challengeId}:${otp}:${getJwtSecret()}`)
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: Math.floor(TOKEN_TTL_MS / 1000),
  })
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload
  if (!decoded.sub || typeof decoded.sub !== 'string' || !decoded.email || typeof decoded.email !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { sub: decoded.sub, email: decoded.email }
}

export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return 'unknown'
}

