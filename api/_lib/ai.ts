import { getAiConfig } from './config.js'

const REQUEST_TIMEOUT_MS = 30000

const parsePrompt = `你是招聘信息结构化助手。请从截图中提取岗位信息，并只返回 JSON，不要返回额外说明。
JSON schema:
{
  "company": "string",
  "position": "string",
  "location": "string",
  "salary": "string",
  "description": "string",
  "requirements": ["string"],
  "benefits": ["string"]
}
如果某项无法识别，请返回空字符串或空数组。`

export interface ScreenshotParseResult {
  company: string
  position: string
  location: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
}

function stripMarkdownCodeFence(text: string): string {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function normalizeParseResult(payload: Partial<ScreenshotParseResult>): ScreenshotParseResult {
  return {
    company: payload.company?.trim() ?? '',
    position: payload.position?.trim() ?? '',
    location: payload.location?.trim() ?? '',
    salary: payload.salary?.trim() ?? '',
    description: payload.description?.trim() ?? '',
    requirements: (payload.requirements ?? []).map((item) => item.trim()).filter(Boolean),
    benefits: (payload.benefits ?? []).map((item) => item.trim()).filter(Boolean),
  }
}

function buildProviderRequestBody(provider: string, model: string, imageDataUrl: string) {
  const baseMessages = [
    { role: 'system', content: parsePrompt },
    {
      role: 'user',
      content: [
        { type: 'text', text: '请识别这张招聘截图并返回结构化字段。' },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    },
  ]
  if (provider === 'zhipu') {
    return { model, temperature: 0.1, messages: baseMessages }
  }
  return {
    model,
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: baseMessages,
  }
}

function extractRawText(data: unknown): string {
  const payload = data as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>
    output_text?: string
  }
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim()
  const messageContent = payload.choices?.[0]?.message?.content
  if (typeof messageContent === 'string') return messageContent
  return messageContent?.map((item) => item.text ?? '').join('').trim() ?? ''
}

export async function parseScreenshotWithProvider(imageDataUrl: string): Promise<ScreenshotParseResult> {
  const aiConfig = getAiConfig()
  const provider = aiConfig.provider
  const model = aiConfig.model
  const apiUrl = aiConfig.apiUrl
  const apiKey = aiConfig.apiKey
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(buildProviderRequestBody(provider, model, imageDataUrl)),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`AI parse failed (${response.status}): ${text || 'Unknown error'}`)
  }
  const data = await response.json()
  const rawText = extractRawText(data)
  if (!rawText) {
    throw new Error('AI returned empty content')
  }
  const normalizedText = stripMarkdownCodeFence(rawText)
  const parsed = JSON.parse(normalizedText) as Partial<ScreenshotParseResult>
  return normalizeParseResult(parsed)
}

