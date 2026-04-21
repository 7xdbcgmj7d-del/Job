import type { VercelRequest, VercelResponse } from '@vercel/node'

import { db } from '../_lib/db.js'
import { verifyAccessToken } from '../_lib/auth.js'
import { createRequestId, sendError, sendJson } from '../_lib/http.js'

function readBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const [prefix, token] = authHeader.split(' ')
  if (prefix !== 'Bearer' || !token) return null
  return token
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = createRequestId()
  if (req.method !== 'GET') {
    sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed', requestId)
    return
  }

  const token = readBearerToken(req.headers.authorization)
  if (!token) {
    sendError(res, 401, 'UNAUTHORIZED', 'Missing bearer token', requestId)
    return
  }

  let payload: { sub: string; email: string }
  try {
    payload = verifyAccessToken(token)
  } catch {
    sendError(res, 401, 'UNAUTHORIZED', 'Invalid token', requestId)
    return
  }

  const user = await db.user.findUnique({ where: { id: payload.sub } })
  if (!user) {
    sendError(res, 401, 'UNAUTHORIZED', 'User not found', requestId)
    return
  }

  sendJson(res, 200, {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    title: user.title ?? '求职者',
    status: user.status ?? '求职中',
  })
}

