import { DollarSign, Pencil, Paperclip, Trash2 } from 'lucide-react'

interface JobCardProps {
 id?: number
 company: string
 position: string
 salary: string
 status: string
 bgColor: string
 hasResume?: boolean
 sourceUrl?: string
 statusOptions?: string[]
 onStatusChange?: (jobId: number, status: string) => void
 onEdit?: (jobId: number) => void
 onDelete?: (jobId: number) => void
 onRecommendedAction?: (jobId: number, status: string) => void
}

const statusColors: Record<string, string> = {
 待投递: 'bg-gray-100 text-gray-700',
 已投递: 'bg-indigo-100 text-indigo-700',
 筛选中: 'bg-blue-100 text-blue-700',
 面试中: 'bg-purple-100 text-purple-700',
 Offer: 'bg-green-100 text-green-700',
 已淘汰: 'bg-red-100 text-red-700',
 已撤回: 'bg-zinc-100 text-zinc-700',
}

export function JobCard({
 id,
 company,
 position,
 salary,
 status,
 bgColor,
 hasResume,
 sourceUrl,
 statusOptions = [],
 onStatusChange,
 onEdit,
 onDelete,
 onRecommendedAction,
}: JobCardProps) {
 const normalizedSourceUrl = sourceUrl?.trim()
 const hasValidSourceUrl = Boolean(normalizedSourceUrl && /^https?:\/\//i.test(normalizedSourceUrl))
 const recommendationByStatus: Record<string, string> = {
 待投递: '去投递',
 已投递: '去跟进',
 筛选中: '催进度',
 面试中: '记复盘',
 Offer: '准备谈薪',
 }
 const recommendationLabel = recommendationByStatus[status]

 return (
 <div
 className="flex min-h-[200px] w-full flex-col justify-between rounded-[30px] p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
 style={{ backgroundColor: bgColor }}
 >
 <div className="mb-3 flex items-start justify-between gap-2">
 <div className="rounded-full bg-white/60 px-3 py-1 backdrop-blur-sm">
 <span className="text-xs font-semibold text-[#1a1a1a]">{company}</span>
 </div>
 {onStatusChange && id !== undefined ? (
 <select
 value={status}
 onClick={(e) => e.stopPropagation()}
 onChange={(event) => onStatusChange(id, event.target.value)}
 className={`max-w-[120px] shrink-0 rounded-full border-0 px-2 py-1 text-xs font-semibold focus:outline-none ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}
 >
 {statusOptions.map((option) => (
 <option key={option} value={option}>
 {option}
 </option>
 ))}
 </select>
 ) : (
 <div
 className={`rounded-full px-3 py-1 ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}
 >
 <span className="text-xs font-semibold">{status}</span>
 </div>
 )}
 </div>

 <div className="mb-3 flex-1">
 <h3 className="line-clamp-2 text-lg font-semibold text-[#1a1a1a]">{position}</h3>
 </div>

 <div className="mb-3 flex items-center justify-between">
 <div className="flex items-center gap-1.5">
 <DollarSign size={16} className="text-[#1a1a1a]" />
 <span className="text-sm font-semibold text-[#1a1a1a]">{salary}</span>
 </div>
 {hasResume || hasValidSourceUrl ? (
 hasValidSourceUrl ? (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 window.open(normalizedSourceUrl, '_blank', 'noopener,noreferrer')
 }}
 aria-label="打开岗位来源链接"
 title="打开岗位来源链接"
 className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/60 transition hover:bg-white/85"
 >
 <Paperclip size={16} className="text-[#1a1a1a]" />
 </button>
 ) : (
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60">
 <Paperclip size={16} className="text-[#1a1a1a]" />
 </div>
 )
 ) : null}
 </div>
 {recommendationLabel && onRecommendedAction && id !== undefined ? (
 <button
 type="button"
 className="mb-3 w-full rounded-full border border-[#1a1a1a]/20 bg-white/65 py-1.5 text-xs font-semibold text-[#1a1a1a] transition hover:bg-white"
 onClick={(e) => {
 e.stopPropagation()
 onRecommendedAction(id, status)
 }}
 >
 下一步：{recommendationLabel}
 </button>
 ) : null}

 {(onEdit || onDelete) && id !== undefined ? (
 <div className="flex gap-2 border-t border-black/5 pt-3">
 {onEdit ? (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 onEdit(id)
 }}
 className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white/70 py-2 text-xs font-semibold text-[#1a1a1a] transition-colors hover:bg-white"
 >
 <Pencil size={14} />
 编辑
 </button>
 ) : null}
 {onDelete ? (
 <button
 type="button"
 onClick={(e) => {
 e.stopPropagation()
 onDelete(id)
 }}
 className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white/70 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-white"
 >
 <Trash2 size={14} />
 删除
 </button>
 ) : null}
 </div>
 ) : null}
 </div>
 )
}
