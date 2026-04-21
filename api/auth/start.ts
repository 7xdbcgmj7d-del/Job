import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { db } from '../_lib/db.js'
import { generateChallengeId, generateOtpCode, getClientIp, hashOtp, otpExpiresAtMs } from '../_lib/auth.js'
import { createRequestId, sendError, sendJson } from '../_lib/http.js'
import { sendOtpEmail } from '../_lib/resend.js'

const StartSchema = z.object({
  provider: z.literal('email'),
  email: z.string().email(),
})

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = createRequestId()
  if (req.method !== 'POST') {
    sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed', requestId)
    return
  }

  const parsed = StartSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, 400, 'BAD_REQUEST', 'Invalid request payload', requestId)
    return
  }

  const email = parsed.data.email.toLowerCase().trim()
  const ip = getClientIp(req.headers)

  const oneMinuteAgo = new Date(Date.now() - 60_000)
  const recentCountByEmail = await db.authChallenge.count({
    where: { email, createdAt: { gte: oneMinuteAgo } },
  })
  const recentCountByIp = await db.authChallenge.count({
    where: { ipAddress: ip, createdAt: { gte: oneMinuteAgo } },
  })
  if (recentCountByEmail >= 3 || recentCountByIp >= 10) {
    sendError(res, 429, 'RATE_LIMITED', 'Too many requests, try later', requestId)
    return
  }

  const challengeId = generateChallengeId()
  const otp = generateOtpCode()
  const otpDigest = hashOtp(challengeId, otp)

  await db.authChallenge.create({
    data: {
      id: challengeId,
      email,
      otpDigest,
      ipAddress: ip,
      expiresAt: new Date(otpExpiresAtMs()),
    },
  })

  try {
    await sendOtpEmail(email, otp)
  } catch {
    sendError(res, 500, 'EMAIL_SEND_FAILED', 'Failed to send verification email', requestId)
    return
  }

  sendJson(res, 200, {
    challengeId,
    message: '验证码已发送',
  })
}

