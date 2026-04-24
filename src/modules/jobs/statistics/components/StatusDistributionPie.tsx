import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { JOB_STATUSES, type JobItem } from '../../types'

const STATUS_COLORS: Record<(typeof JOB_STATUSES)[number], string> = {
 待投递: '#d4d4d8',
 已投递: '#93c5fd',
 筛选中: '#a7f3d0',
 面试中: '#fcd34d',
 Offer: '#86efac',
 已淘汰: '#fca5a5',
 已撤回: '#c4b5fd',
}

export function StatusDistributionPie({ jobs }: { jobs: JobItem[] }) {
 const data = useMemo(
 () =>
 JOB_STATUSES.map((status) => ({
 name: status,
 value: jobs.filter((job) => job.status === status).length,
 color: STATUS_COLORS[status],
 })).filter((item) => item.value > 0),
 [jobs]
 )

 return (
 <div className="rounded-[20px] bg-white p-5">
 <h4 className="mb-1 text-sm font-semibold text-[#1a1a1a]">状态分布</h4>
 <p className="mb-3 text-xs text-[#666666]">按全量岗位状态实时统计</p>
 {data.length === 0 ? (
 <p className="text-xs text-[#888888]">暂无岗位数据。</p>
 ) : (
 <>
 <div className="h-44 w-full">
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2}>
 {data.map((entry) => (
 <Cell key={entry.name} fill={entry.color} />
 ))}
 </Pie>
 <Tooltip
 contentStyle={{ borderRadius: 12, border: '1px solid #e8e6e2', fontSize: 12 }}
 formatter={(value) => [`${Number(value ?? 0)} 个`, '数量']}
 />
 </PieChart>
 </ResponsiveContainer>
 </div>
 <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
 {data.map((item) => (
 <li key={item.name} className="flex items-center justify-between rounded-lg bg-[#fbfaf8] px-2.5 py-1.5">
 <span className="inline-flex items-center gap-1.5 text-[#666666]">
 <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
 {item.name}
 </span>
 <span className="font-semibold text-[#1a1a1a]">{item.value}</span>
 </li>
 ))}
 </ul>
 </>
 )}
 </div>
 )
}
