import { useState } from 'react'

import { getAllowedStatusOptions } from '../../domain/job-status-rules'
import type { JobItem, JobStatus } from '../../types'
import { JobCard } from './JobCard'

interface KanbanBoardProps {
 jobs: JobItem[]
 statuses: string[]
 onStatusChange: (jobId: number, status: string) => void
 onEditJob?: (jobId: number) => void
 onDeleteJob?: (jobId: number) => void
}

export function KanbanBoard({ jobs, statuses, onStatusChange, onEditJob, onDeleteJob }: KanbanBoardProps) {
 const [dragOverStatus, setDragOverStatus] = useState<string | null>(null)

 return (
 <div className="grid min-w-max grid-cols-5 gap-4 pb-2 xl:grid-cols-7">
 {statuses.map((status) => {
 const statusJobs = jobs.filter((job) => job.status === status)

 return (
 <section
 key={status}
 className={`w-72 rounded-3xl p-4 transition-colors ${
 dragOverStatus === status ? 'bg-[#ece8e1]' : 'bg-[#f4f2ee]'
 }`}
 onDragOver={(event) => {
 event.preventDefault()
 setDragOverStatus(status)
 }}
 onDragLeave={() => setDragOverStatus((prev) => (prev === status ? null : prev))}
 onDrop={(event) => {
 event.preventDefault()
 const raw = event.dataTransfer.getData('text/plain')
 const jobId = Number.parseInt(raw, 10)
 if (!Number.isNaN(jobId)) {
 onStatusChange(jobId, status)
 }
 setDragOverStatus(null)
 }}
 >
 <div className="mb-4 flex items-center justify-between">
 <h3 className="text-sm font-semibold text-[#1a1a1a]">{status}</h3>
 <span className="rounded-full bg-white px-2.5 py-1 text-xs text-[#666666]">
 {statusJobs.length}
 </span>
 </div>

 <div className="space-y-3">
 {statusJobs.length > 0 ? (
 statusJobs.map((job) => (
 <div
 key={job.id}
 draggable
 onDragStart={(event) => {
 event.dataTransfer.setData('text/plain', String(job.id))
 event.dataTransfer.effectAllowed = 'move'
 }}
 className="cursor-move"
 >
 <JobCard
 {...job}
 id={job.id}
 statusOptions={getAllowedStatusOptions(job.status as JobStatus)}
 onStatusChange={onStatusChange}
 onEdit={onEditJob}
 onDelete={onDeleteJob}
 />
 </div>
 ))
 ) : (
 <div className="rounded-2xl border border-dashed border-[#ddd6cc] bg-[#fbfaf8] p-4 text-center text-xs text-[#666666]">
 暂无岗位
 </div>
 )}
 </div>
 </section>
 )
 })}
 </div>
 )
}
