import { JOB_STATUSES, type JobStatus } from '../types'

/**
 * PRD 3.2.4 主路径 + 终止态；允许保留「当前状态」便于下拉展示。
 * 已淘汰 / 已撤回后仅允许回到「待投递」做纠错或重新投递。
 */
const ALLOWED_NEXT: Record<JobStatus, readonly JobStatus[]> = {
  待投递: ['待投递', '已投递', '已撤回'],
  已投递: ['已投递', '待投递', '筛选中', '已淘汰', '已撤回'],
  筛选中: ['筛选中', '已投递', '面试中', '已淘汰', '已撤回'],
  面试中: ['面试中', '筛选中', 'Offer', '已淘汰', '已撤回'],
  Offer: ['Offer', '面试中', '已撤回'],
  已淘汰: ['已淘汰', '待投递'],
  已撤回: ['已撤回', '待投递'],
}

export function getAllowedStatusOptions(current: JobStatus): JobStatus[] {
  const allowed = new Set<JobStatus>(ALLOWED_NEXT[current] as readonly JobStatus[])
  return JOB_STATUSES.filter((s) => allowed.has(s))
}

export function isStatusTransitionAllowed(from: JobStatus, to: JobStatus): boolean {
  return (ALLOWED_NEXT[from] as readonly JobStatus[]).includes(to)
}
