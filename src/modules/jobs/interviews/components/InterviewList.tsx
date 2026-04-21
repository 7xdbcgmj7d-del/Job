import { Phone, Video } from 'lucide-react'
import { useMemo } from 'react'

import { formatInterviewDateTime } from '@/modules/interviews/utils/formatInterviewDateTime'
import { useAppState } from '@/state/AppStateContext'

export function InterviewList() {
  const { interviews, jobs } = useAppState()
  const ordered = useMemo(
    () =>
      [...interviews]
        .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()),
    [interviews]
  )

  return (
    <div className="space-y-3">
      <h4 className="mb-3 text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">近期面试</h4>
      {ordered.length === 0 ? (
        <div className="rounded-[20px] bg-white p-4 text-xs text-[#888888] dark:bg-[#1f1f1f] dark:text-[#9a9a9a]">暂无面试安排。</div>
      ) : (
        ordered.map((interview) => {
          const linkedJob = jobs.find((job) => job.id === interview.jobId)
          const bgColor = linkedJob?.bgColor ?? '#f4f2ee'
          return (
            <div
              key={interview.id}
              className="flex items-center justify-between rounded-[20px] p-4"
              style={{ backgroundColor: bgColor }}
            >
              <div>
                <div className="text-sm font-semibold text-[#1a1a1a]">{interview.company}</div>
                <div className="mt-0.5 text-xs text-[#666666]">{interview.jobTitle}</div>
                <div className="mt-0.5 text-xs text-[#666666]">{formatInterviewDateTime(interview.scheduledAt)}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60">
                {interview.meetingUrl ? (
                  <Video size={18} className="text-[#1a1a1a]" />
                ) : (
                  <Phone size={18} className="text-[#1a1a1a]" />
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
