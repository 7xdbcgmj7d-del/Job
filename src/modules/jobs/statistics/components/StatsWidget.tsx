import { useMemo, type ReactNode } from 'react'

import type { JobItem } from '../../types'

interface StatItemProps {
 label: string
 value: ReactNode
 color?: string
}

function StatItem({ label, value, color }: StatItemProps) {
 return (
 <div className="flex flex-col items-center gap-1">
 <div
 className="text-2xl font-extrabold text-[#1a1a1a]"
 style={color ? { color } : undefined}
 >
 {value}
 </div>
 <div className="text-xs text-[#666666]">{label}</div>
 </div>
 )
}

export function StatsWidget({ jobs }: { jobs: JobItem[] }) {
 const { total, interviewing, offers, conversion } = useMemo(() => {
 const total = jobs.length
 const interviewing = jobs.filter((j) => j.status === '待面试').length
 const offers = jobs.filter((j) => j.status === 'Offer').length
 const conversion = total > 0 ? Math.round((offers / total) * 100) : 0
 return { total, interviewing, offers, conversion }
 }, [jobs])

 return (
 <div className="grid grid-cols-2 gap-4 rounded-[20px] bg-white p-5 sm:grid-cols-4">
 <StatItem label="总投递" value={total} />
 <StatItem label="待面试" value={interviewing} />
 <StatItem label="Offer" value={offers} color="#4CAF50" />
 <StatItem label="转化率" value={`${conversion}%`} />
 </div>
 )
}
