import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { InterviewTimelineRecord } from '@/modules/interviews/types'

import type { JobItem } from '../../types'
import { ApplicationTrendChart } from './ApplicationTrendChart'
import { RecentActivityFeed } from './RecentActivityFeed'
import { StatusDistributionPie } from './StatusDistributionPie'

function DecisionAlerts({ jobs }: { jobs: JobItem[] }) {
 const today = new Date()
 const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
 const staleApplied = jobs.filter((job) => {
 if (!job.appliedAt) return false
 if (!['已投递', '筛选中'].includes(job.status)) return false
 const appliedAt = new Date(`${job.appliedAt}T00:00:00`)
 return today.getTime() - appliedAt.getTime() >= sevenDaysMs
 })

 return (
 <div className="rounded-[20px] bg-white p-5">
 <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">决策提醒</h4>
 {staleApplied.length > 0 ? (
 <p className="text-xs text-[#5b4b00]">
 已投递超过 7 天未跟进岗位 {staleApplied.length} 个，建议今天优先跟进。
 </p>
 ) : (
 <p className="text-xs text-[#666666]">暂无超期未跟进岗位，节奏健康。</p>
 )}
 </div>
 )
}

export function StatisticsPanel({
 jobs,
 interviews,
}: {
 jobs: JobItem[]
 interviews: InterviewTimelineRecord[]
}) {
 return (
 <Tabs defaultValue="distribution" className="w-full gap-3">
 <TabsList className="h-auto min-h-9 w-full flex-wrap bg-white/90 p-1">
 <TabsTrigger
 value="distribution"
 className="rounded-full px-2 py-1 text-[11px] data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
 >
 状态分布
 </TabsTrigger>
 <TabsTrigger
 value="trend"
 className="rounded-full px-2 py-1 text-[11px] data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
 >
 30 日趋势
 </TabsTrigger>
 <TabsTrigger
 value="activity"
 className="rounded-full px-2 py-1 text-[11px] data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
 >
 动态
 </TabsTrigger>
 <TabsTrigger
 value="alerts"
 className="rounded-full px-2 py-1 text-[11px] data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white"
 >
 决策
 </TabsTrigger>
 </TabsList>
 <TabsContent value="distribution" className="mt-0">
 <StatusDistributionPie jobs={jobs} />
 </TabsContent>
 <TabsContent value="trend" className="mt-0">
 <ApplicationTrendChart jobs={jobs} />
 </TabsContent>
 <TabsContent value="activity" className="mt-0">
 <RecentActivityFeed jobs={jobs} interviews={interviews} />
 </TabsContent>
 <TabsContent value="alerts" className="mt-0">
 <DecisionAlerts jobs={jobs} />
 </TabsContent>
 </Tabs>
 )
}
