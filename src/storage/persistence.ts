import type { AppPersistedStateV1 } from '@/domain/app-state'
import { APP_STATE_SCHEMA_VERSION } from '@/domain/app-state'
import { initialJobsData } from '@/modules/jobs/data/initial-jobs'
import { defaultInterviewTimeline } from '@/modules/interviews/timeline/mock-data'
import { JOB_STATUSES, type JobItem, type JobStatus } from '@/modules/jobs/types'
import { RESUME_SEED_VERSIONS } from '@/modules/resumes/constants'
import type { ResumeVersion } from '@/modules/resumes/types'
import type { InterviewTimelineRecord } from '@/modules/interviews/types'
import { normalizeAppSettings } from '@/modules/settings/utils'

export const APP_STATE_STORAGE_KEY = 'job-tracker-app-state-v1'

/** 迁移前简历独立存储 key（合并进 app state 后由 save 清理） */
const LEGACY_RESUME_STORAGE_KEY = 'job-tracker-resumes-v1'
const INTERVIEW_STATUSES = ['已安排', '已完成', '已取消', '已改期'] as const
const INTERVIEW_ROUND_TYPES = ['HR初筛', '技术面', '主管面', '总监面', 'HR终面', '群面', '案例面', '其他'] as const

function tryParseJson(raw: string): unknown {
 try {
 return JSON.parse(raw) as unknown
 } catch {
 return null
 }
}

function loadLegacyResumes(): ResumeVersion[] {
 try {
 const raw = localStorage.getItem(LEGACY_RESUME_STORAGE_KEY)
 if (!raw) return []
 const parsed = tryParseJson(raw)
 if (!Array.isArray(parsed) || parsed.length === 0) return []
 return parsed as ResumeVersion[]
 } catch {
 return []
 }
}

function sanitizeJobItem(raw: unknown, fallback: JobItem, index: number): JobItem {
 const obj = raw && typeof raw === 'object' ? (raw as Partial<JobItem>) : {}
 const safeStatus = JOB_STATUSES.includes(obj.status as JobStatus)
 ? (obj.status as JobStatus)
 : fallback.status
 const idValue = typeof obj.id === 'number' && Number.isFinite(obj.id) ? Math.trunc(obj.id) : fallback.id + index
 const company = String(obj.company ?? '').trim() || fallback.company
 const position = String(obj.position ?? '').trim() || fallback.position
 const salary = String(obj.salary ?? '').trim() || fallback.salary
 const bgColor = String(obj.bgColor ?? '').trim() || fallback.bgColor
 return {
 ...fallback,
 ...obj,
 id: idValue,
 company,
 position,
 salary,
 bgColor,
 status: safeStatus,
 }
}

function sanitizeInterviews(raw: unknown, jobs: JobItem[]): InterviewTimelineRecord[] {
 if (!Array.isArray(raw)) return [...defaultInterviewTimeline]
 const fallbackFirstJobId = jobs[0]?.id ?? 1
 return raw
 .map((item, index) => {
 const record = item as Partial<InterviewTimelineRecord> & { jobId?: unknown }
 const maybeJobId = typeof record.jobId === 'number' ? record.jobId : NaN
 const linkedJob =
 jobs.find((job) => job.id === maybeJobId) ??
 jobs.find((job) => job.company === record.company && job.position === record.jobTitle)
 const status = INTERVIEW_STATUSES.includes(record.status as (typeof INTERVIEW_STATUSES)[number])
 ? (record.status as InterviewTimelineRecord['status'])
 : '已安排'
 const roundType = INTERVIEW_ROUND_TYPES.includes(record.roundType as (typeof INTERVIEW_ROUND_TYPES)[number])
 ? (record.roundType as InterviewTimelineRecord['roundType'])
 : 'HR初筛'
 const when = new Date(String(record.scheduledAt ?? ''))
 const scheduledAt = Number.isNaN(when.getTime())
 ? new Date(Date.now() + (index + 1) * 86400000).toISOString()
 : when.toISOString()
 return {
 id: String(record.id ?? `int-fallback-${index + 1}`),
 jobId: linkedJob?.id ?? fallbackFirstJobId,
 company: String(record.company ?? linkedJob?.company ?? '未知公司'),
 jobTitle: String(record.jobTitle ?? linkedJob?.position ?? '未知岗位'),
 roundType,
 roundNumber:
 typeof record.roundNumber === 'number' && Number.isFinite(record.roundNumber) && record.roundNumber > 0
 ? Math.trunc(record.roundNumber)
 : 1,
 status,
 scheduledAt,
 durationMinutes:
 typeof record.durationMinutes === 'number' && Number.isFinite(record.durationMinutes) && record.durationMinutes > 0
 ? Math.trunc(record.durationMinutes)
 : 60,
 location: typeof record.location === 'string' ? record.location : undefined,
 meetingUrl: typeof record.meetingUrl === 'string' ? record.meetingUrl : undefined,
 interviewer: typeof record.interviewer === 'string' ? record.interviewer : undefined,
 remark: typeof record.remark === 'string' ? record.remark : undefined,
 debrief: record.debrief,
 }
 })
 .filter((record) => Boolean(record.company && record.jobTitle))
}

export function normalizeState(raw: Partial<AppPersistedStateV1>): AppPersistedStateV1 {
 const rawJobs = Array.isArray(raw.jobs) ? raw.jobs : initialJobsData
 const jobs = rawJobs.map((job, index) =>
 sanitizeJobItem(job, initialJobsData[index % initialJobsData.length], index)
 )
 const interviews = sanitizeInterviews(raw.interviews, jobs)
 return {
 schemaVersion: APP_STATE_SCHEMA_VERSION,
 jobs,
 interviews,
 resumes: Array.isArray(raw.resumes) ? raw.resumes : [...RESUME_SEED_VERSIONS],
 settings: normalizeAppSettings(raw.settings),
 }
}

function parseStoredAppState(raw: string): AppPersistedStateV1 | null {
 const parsed = tryParseJson(raw)
 if (!parsed || typeof parsed !== 'object') return null
 const o = parsed as Record<string, unknown>
 if (!Array.isArray(o.jobs)) return null
 return normalizeState({
 ...(parsed as Partial<AppPersistedStateV1>),
 schemaVersion: APP_STATE_SCHEMA_VERSION,
 })
}

/**
 * 读取并迁移为当前 schema。
 * - 若存在主 key：校验后规范化。
 * - 若无主 key：用默认岗位/面试 +（若有）旧版简历列表，否则用简历种子。
 */
export function loadAppState(): AppPersistedStateV1 {
 try {
 const raw = localStorage.getItem(APP_STATE_STORAGE_KEY)
 if (raw) {
 const parsed = parseStoredAppState(raw)
 if (parsed) return parsed
 }
 } catch {
 /* ignore */
 }

 const legacyResumes = loadLegacyResumes()
 return normalizeState({
 schemaVersion: APP_STATE_SCHEMA_VERSION,
 jobs: [...initialJobsData],
 interviews: [...defaultInterviewTimeline],
 resumes: legacyResumes.length > 0 ? legacyResumes : [...RESUME_SEED_VERSIONS],
 settings: normalizeAppSettings(undefined),
 })
}

export function saveAppState(state: AppPersistedStateV1): void {
 const payload: AppPersistedStateV1 = {
 ...state,
 schemaVersion: APP_STATE_SCHEMA_VERSION,
 }
 try {
 localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(payload))
 if (localStorage.getItem(LEGACY_RESUME_STORAGE_KEY)) {
 localStorage.removeItem(LEGACY_RESUME_STORAGE_KEY)
 }
 } catch {
 /* quota 等 */
 }
}

export function parseImportedAppState(raw: string): AppPersistedStateV1 {
 const parsed = tryParseJson(raw)
 if (!parsed || typeof parsed !== 'object') {
 throw new Error('导入失败：JSON 格式无效。')
 }
 const o = parsed as Record<string, unknown>
 if (!Array.isArray(o.jobs)) {
 throw new Error('导入失败：缺少 jobs 数组。')
 }
 return normalizeState({
 ...(parsed as Partial<AppPersistedStateV1>),
 schemaVersion: APP_STATE_SCHEMA_VERSION,
 })
}
