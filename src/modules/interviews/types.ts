/** PRD 3.5.3 面试信息 + 3.5.4 复盘信息 */

export type InterviewRoundType =
 | 'HR初筛'
 | '技术面'
 | '主管面'
 | '总监面'
 | 'HR终面'
 | '群面'
 | '案例面'
 | '其他'

export type InterviewScheduleStatus = '待安排' | '已安排' | '已完成' | '已取消' | '已改期'

/** PRD 3.5.4 复盘信息字段 */
export interface InterviewDebrief {
 questions: string[]
 selfRating: number
 highlights: string[]
 improvements: string[]
 followUp: string
 otherNotes: string
}

export interface InterviewTimelineRecord {
 id: string
 jobId: number
 jobTitle: string
 company: string
 roundType: InterviewRoundType
 roundNumber: number
 status: InterviewScheduleStatus
 /** ISO 8601 */
 scheduledAt: string
 durationMinutes: number
 location?: string
 meetingUrl?: string
 interviewer?: string
 remark?: string
 debrief?: InterviewDebrief
}

export const EMPTY_DEBRIEF: InterviewDebrief = {
 questions: [''],
 selfRating: 3,
 highlights: [''],
 improvements: [''],
 followUp: '',
 otherNotes: '',
}
