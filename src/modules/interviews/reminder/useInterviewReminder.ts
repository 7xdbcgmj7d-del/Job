import { useEffect, useRef } from 'react'

import type { InterviewTimelineRecord } from '../types'

const REMIND_BEFORE_MS = 15 * 60 * 1000
const CHECK_INTERVAL_MS = 30 * 1000

export function useInterviewReminder(interviews: InterviewTimelineRecord[]) {
  const notifiedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    if (
      interviews.some((item) => item.status === '已安排') &&
      window.Notification.permission === 'default'
    ) {
      void window.Notification.requestPermission()
    }
  }, [interviews])

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    if (window.Notification.permission !== 'granted') return

    const check = () => {
      const now = Date.now()
      for (const interview of interviews) {
        if (interview.status !== '已安排') continue
        const scheduledAt = new Date(interview.scheduledAt).getTime()
        if (Number.isNaN(scheduledAt)) continue
        const diff = scheduledAt - now
        if (diff < 0 || diff > REMIND_BEFORE_MS) continue

        const key = `${interview.id}-${new Date(interview.scheduledAt).toISOString()}`
        if (notifiedRef.current.has(key)) continue

        new window.Notification('面试提醒', {
          body: `${interview.company} · ${interview.jobTitle} 将在 15 分钟内开始`,
          tag: `interview-reminder-${interview.id}`,
        })
        notifiedRef.current.add(key)
      }
    }

    check()
    const timer = window.setInterval(check, CHECK_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [interviews])
}
