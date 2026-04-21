import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { parseScreenshotWithProvider } from '../_lib/ai.js'
import { createRequestId, sendError, sendJson } from '../_lib/http.js'

const ParseSchema = z.object({
  imageDataUrl: z.string().min(1),
})

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const requestId = createRequestId()
  if (req.method !== 'POST') {
    sendError(res, 405, 'METHOD_NOT_ALLOWED', 'Method not allowed', requestId)
    return
  }

  const parsed = ParseSchema.safeParse(req.body)
  if (!parsed.success) {
    sendError(res, 400, 'BAD_REQUEST', 'Invalid request payload', requestId)
    return
  }
  const { imageDataUrl } = parsed.data
  if (!imageDataUrl.startsWith('data:image/')) {
    sendError(res, 400, 'BAD_REQUEST', 'imageDataUrl must be a data image URL', requestId)
    return
  }
  try {
    const result = await parseScreenshotWithProvider(imageDataUrl)
    sendJson(res, 200, result)
  } catch (error) {
    sendError(
      res,
      502,
      'AI_PARSE_FAILED',
      error instanceof Error ? error.message : 'AI parse failed',
      requestId
    )
  }
}

