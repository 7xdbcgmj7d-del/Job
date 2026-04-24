export type AIProvider = 'tongyi' | 'doubao' | 'zhipu'
export type OAuthProvider = 'google' | 'github' | 'wechat'
export type ThemeMode = 'light'

export interface AIProviderConfig {
 apiKey: string
 apiUrl: string
 model: string
}

export interface AppSettings {
 aiProvider: AIProvider
 aiConfigs: Record<AIProvider, AIProviderConfig>
 oauth: {
 provider: OAuthProvider
 clientId: string
 authorizeUrl: string
 tokenUrl: string
 userInfoUrl: string
 redirectUri: string
 scope: string
 }
 theme: ThemeMode
 interviewQuestionBank: string[]
}
