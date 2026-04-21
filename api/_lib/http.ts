import type { VercelResponse } from '@vercel/node'

export function sendJson(res: VercelResponse, status: number, payload: unknown): void {
  res.status(status).json(payload)
}

export function sendError(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
  requestId: string
): void {
  sendJson(res, status, {
    error: {
      code,
      message,
      requestId,
    },
  })
}

export function createRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

