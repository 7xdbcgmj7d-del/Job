import type { AppSettings } from './types'
import type { AIProvider } from './types'

const DEFAULT_DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const DEFAULT_DOUBAO_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const DEFAULT_ZHIPU_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export const PROVIDER_LABELS: Record<AIProvider, string> = {
 tongyi: '通义千问',
 doubao: '豆包',
 zhipu: '智谱',
}

export const PROVIDER_PRESETS: Record<AIProvider, { apiUrl: string; model: string }> = {
 tongyi: {
 apiUrl: DEFAULT_DASHSCOPE_URL,
 model: 'qwen-vl-plus',
 },
 doubao: {
 apiUrl: DEFAULT_DOUBAO_URL,
 model: 'doubao-1.5-vision-pro-32k',
 },
 zhipu: {
 apiUrl: DEFAULT_ZHIPU_URL,
 model: 'glm-4v-plus',
 },
}

export const DEFAULT_SETTINGS: AppSettings = {
 aiProvider: 'tongyi',
 aiConfigs: {
 tongyi: {
 apiKey: '',
 apiUrl: PROVIDER_PRESETS.tongyi.apiUrl,
 model: PROVIDER_PRESETS.tongyi.model,
 },
 doubao: {
 apiKey: '',
 apiUrl: PROVIDER_PRESETS.doubao.apiUrl,
 model: PROVIDER_PRESETS.doubao.model,
 },
 zhipu: {
 apiKey: '',
 apiUrl: PROVIDER_PRESETS.zhipu.apiUrl,
 model: PROVIDER_PRESETS.zhipu.model,
 },
 },
 oauth: {
 provider: 'google',
 clientId: '',
 authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
 tokenUrl: '',
 userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
 redirectUri:
 typeof window !== 'undefined' ? `${window.location.origin}/?auth_callback=1` : '',
 scope: 'openid profile email',
 },
 theme: 'light',
 interviewQuestionBank: [],
}

export function normalizeAppSettings(raw: unknown): AppSettings {
 const obj = raw && typeof raw === 'object' ? (raw as Partial<AppSettings>) : {}
 const aiConfigs = obj.aiConfigs && typeof obj.aiConfigs === 'object' ? obj.aiConfigs : {}
 return {
 aiProvider: obj.aiProvider === 'doubao' || obj.aiProvider === 'zhipu' ? obj.aiProvider : 'tongyi',
 aiConfigs: {
 tongyi: {
 apiKey: String((aiConfigs as Record<string, { apiKey?: string }>)?.tongyi?.apiKey ?? ''),
 apiUrl: String(
 (aiConfigs as Record<string, { apiUrl?: string }>)?.tongyi?.apiUrl ?? PROVIDER_PRESETS.tongyi.apiUrl
 ),
 model: String(
 (aiConfigs as Record<string, { model?: string }>)?.tongyi?.model ?? PROVIDER_PRESETS.tongyi.model
 ),
 },
 doubao: {
 apiKey: String((aiConfigs as Record<string, { apiKey?: string }>)?.doubao?.apiKey ?? ''),
 apiUrl: String(
 (aiConfigs as Record<string, { apiUrl?: string }>)?.doubao?.apiUrl ?? PROVIDER_PRESETS.doubao.apiUrl
 ),
 model: String(
 (aiConfigs as Record<string, { model?: string }>)?.doubao?.model ??
 PROVIDER_PRESETS.doubao.model
 ),
 },
 zhipu: {
 apiKey: String((aiConfigs as Record<string, { apiKey?: string }>)?.zhipu?.apiKey ?? ''),
 apiUrl: String(
 (aiConfigs as Record<string, { apiUrl?: string }>)?.zhipu?.apiUrl ?? PROVIDER_PRESETS.zhipu.apiUrl
 ),
 model: String(
 (aiConfigs as Record<string, { model?: string }>)?.zhipu?.model ?? PROVIDER_PRESETS.zhipu.model
 ),
 },
 },
 oauth: {
 provider:
 obj.oauth?.provider === 'github' || obj.oauth?.provider === 'wechat'
 ? obj.oauth.provider
 : 'google',
 clientId: String(obj.oauth?.clientId ?? ''),
 authorizeUrl: String(
 obj.oauth?.authorizeUrl ?? 'https://accounts.google.com/o/oauth2/v2/auth'
 ),
 tokenUrl: String(obj.oauth?.tokenUrl ?? ''),
 userInfoUrl: String(
 obj.oauth?.userInfoUrl ?? 'https://www.googleapis.com/oauth2/v3/userinfo'
 ),
 redirectUri: String(
 obj.oauth?.redirectUri ??
 (typeof window !== 'undefined' ? `${window.location.origin}/?auth_callback=1` : '')
 ),
 scope: String(obj.oauth?.scope ?? 'openid profile email'),
 },
 // Dark mode removed: keep legacy persisted shape but force light theme.
 theme: 'light',
 interviewQuestionBank: Array.isArray(obj.interviewQuestionBank)
 ? obj.interviewQuestionBank.map((item) => String(item).trim()).filter(Boolean)
 : [],
 }
}
