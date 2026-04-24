import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { JobItem } from '../../types'

function formatDayLabel(isoDate: string) {
 const [, m, d] = isoDate.split('-').map(Number)
 return `${m}/${d}`
}

function last30Days(): string[] {
 const days: string[] = []
 const today = new Date()
 today.setHours(0, 0, 0, 0)
 for (let i = 29; i >= 0; i -= 1) {
 const d = new Date(today)
 d.setDate(d.getDate() - i)
 days.push(d.toISOString().slice(0, 10))
 }
 return days
}

/** PRD 3.6.2：近 30 天投递量趋势（按 appliedAt 计数，排除待投递） */
export function ApplicationTrendChart({ jobs }: { jobs: JobItem[] }) {
 const data = useMemo(() => {
 const range = last30Days()
 const counts = new Map<string, number>()
 for (const day of range) counts.set(day, 0)

 for (const job of jobs) {
 if (job.status === '待投递' || !job.appliedAt) continue
 if (counts.has(job.appliedAt)) {
 counts.set(job.appliedAt, (counts.get(job.appliedAt) ?? 0) + 1)
 }
 }

 return range.map((date) => ({
 date,
 label: formatDayLabel(date),
 count: counts.get(date) ?? 0,
 }))
 }, [jobs])

 return (
 <div className="rounded-[20px] bg-white p-5">
 <h4 className="mb-1 text-sm font-semibold text-[#1a1a1a]">近 30 日投递趋势</h4>
 <p className="mb-3 text-xs text-[#666666]">按岗位「投递日」汇总（非待投递且有投递日）</p>
 <div className="h-40 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e8e6e2" />
 <XAxis
 dataKey="label"
 tick={{ fontSize: 9, fill: '#666666' }}
 interval={4}
 axisLine={false}
 tickLine={false}
 />
 <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#666666' }} width={22} axisLine={false} tickLine={false} />
 <Tooltip
 contentStyle={{ borderRadius: 12, border: '1px solid #e8e6e2', fontSize: 12 }}
 content={({ active, payload }) => {
 if (!active || !payload?.length) return null
 const row = payload[0].payload as { date: string; count: number }
 return (
 <div className="text-xs">
 <div className="font-medium text-[#1a1a1a]">{row.date}</div>
 <div className="text-[#666666]">投递 {row.count} 次</div>
 </div>
 )
 }}
 />
 <Line type="monotone" dataKey="count" name="投递" stroke="#1a1a1a" strokeWidth={2} dot={{ r: 2, fill: '#1a1a1a' }} activeDot={{ r: 4 }} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </div>
 )
}
