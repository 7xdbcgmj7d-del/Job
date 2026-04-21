import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { db } from '../_lib/db.js'
import { accessTokenExpiresAtMs, hashOtp, signAccessToken } from '../_lib/auth.js'
import { createRequestId, sendError, sendJson } from '../_lib/http.js'

const CompleteSchema = z.object({
  provider: z.literal('email'),
  challengeId: z.string().min(1),
  otp: z.string().regex(/^\d{6}$/),
})

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = createRequestId()
  if (req.method !== 'POST') {
    sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed', requestId)
    return
  }

  const parsed = CompleteSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, 400, 'BAD_REQUEST', 'Invalid request payload', requestId)
    return
  }

  const { challengeId, otp } = parsed.data
  const challenge = await db.authChallenge.findUnique({ where: { id: challengeId } })
  if (!challenge) {
    sendError(res, 410, 'CHALLENGE_NOT_FOUND', 'Challenge expired or not found', requestId)
    return
  }
  if (challenge.consumedAt) {
    sendError(res, 410, 'CHALLENGE_ALREADY_USED', 'Challenge already used', requestId)
    return
  }
  if (challenge.expiresAt.getTime() < Date.now()) {
    sendError(res, 410, 'CHALLENGE_EXPIRED', 'Challenge expired', requestId)
    return
  }
  if (challenge.attemptCount >= 5) {
    sendError(res, 429, 'OTP_ATTEMPTS_EXCEEDED', 'Too many invalid attempts', requestId)
    return
  }

  const isValidOtp = hashOtp(challenge.id, otp) === challenge.otpDigest
  if (!isValidOtp) {
    await db.authChallenge.update({
      where: { id: challenge.id },
      data: { attemptCount: { increment: 1 } },
    })
    sendError(res, 401, 'OTP_INVALID', 'Invalid or expired OTP', requestId)
    return
  }

  await db.authChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  })

  const user = await db.user.upsert({
    where: { email: challenge.email },
    update: {},
    create: {
      email: challenge.email,
      name: challenge.email.split('@')[0] || '求职者',
      title: '求职者',
      status: '求职中',
    },
  })

  const accessToken = signAccessToken({ sub: user.id, email: user.email })
  const expiresAt = accessTokenExpiresAtMs()

  sendJson(res, 200, {
    provider: 'email',
    accessToken,
    expiresAt,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? undefined,
      title: user.title ?? '求职者',
      status: user.status ?? '求职中',
    },
  })
}

