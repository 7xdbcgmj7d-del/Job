/** PRD 3.4.3 简历信息字段 */

export type ResumeSourceType = 'file' | 'link'

export interface ResumeVersion {
 id: string
 versionName: string
 versionNote: string
 type: ResumeSourceType
 fileName?: string
 fileMime?: string
 /** data URL 或纯 base64（PDF/Word），仅本地存储 */
 fileData?: string
 link?: string
 targetRoles: string[]
 tags: string[]
 isDefault: boolean
 updatedAt: string
}
