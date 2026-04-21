import type { JobItem, JobStatus, JobStatusChangeEntry, WorkMode, WorkType } from '../types'

export interface JobFormValues {
  company: string
  position: string
  workType: WorkType
  workMode: WorkMode
  location: string
  salary: string
  salaryMonths: string
  priority: string
  sourceChannel: string
  sourceUrl: string
  tags: string
  notes: string
  status: JobStatus
  description: string
  requirements: string
  benefits: string
  linkedResumeId: string
}

export const emptyJobForm: JobFormValues = {
  company: '',
  position: '',
  workType: '全职',
  workMode: '混合',
  location: '',
  salary: '',
  salaryMonths: '',
  priority: '3',
  sourceChannel: '',
  sourceUrl: '',
  tags: '',
  notes: '',
  status: '待投递',
  description: '',
  requirements: '',
  benefits: '',
  linkedResumeId: '',
}

function splitTags(input: string): string[] {
  return input
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function parseSalaryMonths(raw: string): number | undefined {
  const n = Number.parseInt(raw, 10)
  if (Number.isNaN(n) || n < 1) return undefined
  return n
}

function parsePriority(raw: string): number {
  const n = Number.parseInt(raw, 10)
  if (Number.isNaN(n)) return 3
  return Math.min(5, Math.max(1, n))
}

export function jobToFormValues(job: JobItem): JobFormValues {
  return {
    company: job.company,
    position: job.position,
    workType: job.workType ?? '全职',
    workMode: job.workMode ?? '混合',
    location: job.location ?? '',
    salary: job.salary,
    salaryMonths: job.salaryMonths != null ? String(job.salaryMonths) : '',
    priority: String(job.priority ?? 3),
    sourceChannel: job.sourceChannel ?? '',
    sourceUrl: job.sourceUrl ?? '',
    tags: (job.tags ?? []).join('，'),
    notes: job.notes ?? '',
    status: job.status,
    description: job.description ?? '',
    requirements: (job.requirements ?? []).join('\n'),
    benefits: (job.benefits ?? []).join('\n'),
    linkedResumeId: job.linkedResumeId ?? '',
  }
}

export function buildJobItemFromForm(
  draft: JobItem | null,
  form: JobFormValues,
  opts: { bgColorForNew: string }
): JobItem {
  const requirements = form.requirements
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const benefits = form.benefits
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const tags = splitTags(form.tags)
  const salaryMonths = parseSalaryMonths(form.salaryMonths)
  const priority = parsePriority(form.priority)
  const linkedResumeId = form.linkedResumeId.trim() || undefined

  let appliedAt = draft?.appliedAt
  if (form.status === '待投递') {
    appliedAt = undefined
  } else if (!draft) {
    appliedAt = new Date().toISOString().slice(0, 10)
  } else if (draft.status === '待投递') {
    appliedAt = new Date().toISOString().slice(0, 10)
  }

  const history: JobStatusChangeEntry[] = draft?.statusHistory ? [...draft.statusHistory] : []
  if (!draft) {
    if (form.status !== '待投递') {
      history.push({ at: new Date().toISOString(), from: '待投递', to: form.status })
    }
  } else if (draft.status !== form.status) {
    history.push({ at: new Date().toISOString(), from: draft.status, to: form.status })
  }

  const base: JobItem = {
    id: draft?.id ?? 0,
    company: form.company.trim(),
    position: form.position.trim(),
    salary: form.salary.trim() || '—',
    status: form.status,
    bgColor: draft?.bgColor ?? opts.bgColorForNew,
    hasResume: linkedResumeId ? true : (draft?.hasResume ?? false),
    appliedAt,
    workType: form.workType,
    workMode: form.workMode,
    location: form.location.trim() || undefined,
    salaryMonths,
    priority,
    sourceChannel: form.sourceChannel.trim() || undefined,
    sourceUrl: form.sourceUrl.trim() || undefined,
    tags: tags.length ? tags : undefined,
    notes: form.notes.trim() || undefined,
    description: form.description.trim() || undefined,
    requirements: requirements.length ? requirements : undefined,
    benefits: benefits.length ? benefits : undefined,
    linkedResumeId,
    statusHistory: history.length > 0 ? history : undefined,
  }

  return base
}

const BG_PALETTE = ['#fadcd9', '#dcd6f7', '#c8e8d5', '#fbe0c3', '#c5e1a5'] as const

export function pickJobBgColor(id: number): string {
  const i = Math.abs(id - 1) % BG_PALETTE.length
  return BG_PALETTE[i] ?? '#fadcd9'
}
