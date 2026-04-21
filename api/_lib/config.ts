/// <reference types="node" />

type RequiredEnvKey =
  | 'DATABASE_URL'
  | 'JWT_SECRET'
  | 'RESEND_API_KEY'
  | 'EMAIL_FROM'
  | 'AI_PROVIDER'
  | 'AI_API_KEY'
  | 'AI_API_URL'
  | 'AI_MODEL'

function requireEnv(key: RequiredEnvKey): string {
  const value = process.env[key]
  if (!value || !value.trim()) {
    throw new Error(`Missing required env: ${key}`)
  }
  return value.trim()
}

export function getDatabaseUrl(): string {
  return requireEnv('DATABASE_URL')
}

export function getJwtSecret(): string {
  return requireEnv('JWT_SECRET')
}

export function getResendConfig(): { resendApiKey: string; emailFrom: string } {
  return {
    resendApiKey: requireEnv('RESEND_API_KEY'),
    emailFrom: requireEnv('EMAIL_FROM'),
  }
}

export function getAiConfig(): {
  provider: string
  apiKey: string
  apiUrl: string
  model: string
} {
  return {
    provider: requireEnv('AI_PROVIDER'),
    apiKey: requireEnv('AI_API_KEY'),
    apiUrl: requireEnv('AI_API_URL'),
    model: requireEnv('AI_MODEL'),
  }
}
