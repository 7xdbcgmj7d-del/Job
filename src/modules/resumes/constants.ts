import type { ResumeVersion } from './types'

/** 无本地数据且无旧版迁移时的默认简历列表 */
export const RESUME_SEED_VERSIONS: ResumeVersion[] = [
  {
    id: 'seed-1',
    versionName: '产品经理-通用版',
    versionNote: '示例版本，可删除或设为默认',
    type: 'link',
    link: 'https://example.com/my-online-cv',
    targetRoles: ['产品经理', '产品实习'],
    tags: ['中文', '一页纸'],
    isDefault: true,
    updatedAt: new Date().toISOString(),
  },
]
