export const JOB_STATUSES = ['待投递', '已投递', '筛选中', '面试中', 'Offer', '已淘汰', '已撤回'] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export type WorkType = '全职' | '实习' | '兼职' | '合同工'

export type WorkMode = '现场' | '远程' | '混合'

export interface JobStatusChangeEntry {
  at: string
  from: JobStatus
  to: JobStatus
}

export interface JobItem {
  id: number
  company: string
  position: string
  /** 展示用薪资文案，如 150-200K */
  salary: string
  status: JobStatus
  bgColor: string
  hasResume?: boolean
  /** YYYY-MM-DD，用于近 30 日投递趋势与最近动态 */
  appliedAt?: string
  workType?: WorkType
  workMode?: WorkMode
  location?: string
  salaryMonths?: number
  description?: string
  requirements?: string[]
  benefits?: string[]
  sourceChannel?: string
  sourceUrl?: string
  /** 1–5，数字越大优先级越高（PRD） */
  priority?: number
  linkedResumeId?: string
  tags?: string[]
  notes?: string
  /** 状态变更历史（PRD 3.2.2） */
  statusHistory?: JobStatusChangeEntry[]
}
