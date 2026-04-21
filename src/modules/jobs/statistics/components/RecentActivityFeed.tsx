import { useMemo } from 'react'

import { formatInterviewDateTime } from '@/modules/interviews/utils/formatInterviewDateTime'
import type { InterviewTimelineRecord } from '@/modules/interviews/types'

import type { JobItem } from '../../types'

type ActivityRow = {
  id: string
  at: string
  title: string
  subtitle: string
}

function formatInterviewSubtitle(interview: InterviewTimelineRecord): string {
  return `${interview.roundType} · ${interview.status}`
}

/** PRD 3.6.2 P1：最近动态（合并投递与面试事件） */
export function RecentActivityFeed({
  jobs,
  interviews,
}: {
  jobs: JobItem[]
  interviews: InterviewTimelineRecord[]
}) {
  const rows = useMemo<ActivityRow[]>(() => {
    const jobEvents: ActivityRow[] = jobs
      .filter((j) => j.appliedAt)
      .map((job) => ({
        id: `job-${job.id}-${job.appliedAt}`,
        at: `${job.appliedAt}T00:00:00.000Z`,
        title: `${job.company} · ${job.position}`,
        subtitle: `投递 · 当前状态 ${job.status}`,
      }))

    const interviewEvents: ActivityRow[] = interviews.map((interview) => ({
      id: `interview-${interview.id}`,
      at: interview.scheduledAt,
      title: `${interview.company} · ${interview.jobTitle}`,
      subtitle: `面试 · ${formatInterviewSubtitle(interview)}`,
    }))

    return [...jobEvents, ...interviewEvents]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 8)
  }, [jobs, interviews])

  return (
    <div className="rounded-[20px] bg-white p-5 dark:bg-[#1f1f1f]">
      <h4 className="mb-3 text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">最近动态</h4>
      <ul className="space-y-2.5">
        {rows.length === 0 ? (
          <li className="text-xs text-[#888888] dark:text-[#9a9a9a]">暂无投递或面试事件。</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="rounded-xl bg-[#fbfaf8] px-3 py-2 text-xs text-[#1a1a1a] dark:bg-[#2a2a2a] dark:text-[#f5f5f5]">
              <span className="font-medium text-[#666666] dark:text-[#b8b8b8]">
                {row.id.startsWith('interview-')
                  ? formatInterviewDateTime(row.at)
                  : new Date(row.at).toLocaleString('zh-CN')}
              </span>
              <span className="mx-1.5 text-[#ccc] dark:text-[#777777]">·</span>
              <span className="font-semibold">{row.title}</span>
              <span className="text-[#666666] dark:text-[#b8b8b8]"> — {row.subtitle}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
