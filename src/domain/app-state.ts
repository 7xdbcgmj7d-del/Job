import type { JobItem } from '@/modules/jobs/types'
import type { InterviewTimelineRecord } from '@/modules/interviews/types'
import type { ResumeVersion } from '@/modules/resumes/types'
import type { AppSettings } from '@/modules/settings/types'

/** 与 localStorage 中 JSON 对齐；升级时递增并写 migrate */
export const APP_STATE_SCHEMA_VERSION = 1 as const

export interface AppPersistedStateV1 {
 schemaVersion: typeof APP_STATE_SCHEMA_VERSION
 jobs: JobItem[]
 interviews: InterviewTimelineRecord[]
 resumes: ResumeVersion[]
 settings: AppSettings
}
