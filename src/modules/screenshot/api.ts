import type { ScreenshotParseResult } from './types'

export async function parseJobScreenshotWithAI(
  imageDataUrl: string
): Promise<ScreenshotParseResult> {
  const response = await fetch('/api/screenshot/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl }),
  })
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null
    throw new Error(data?.error?.message || `识别失败（${response.status}）`)
  }
  return (await response.json()) as ScreenshotParseResult
}

