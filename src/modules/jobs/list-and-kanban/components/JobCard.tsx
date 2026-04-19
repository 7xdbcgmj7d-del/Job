import { DollarSign, Paperclip } from 'lucide-react'

interface JobCardProps {
  company: string
  position: string
  salary: string
  status: string
  bgColor: string
  hasResume?: boolean
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
  company,
  position,
  salary,
  status,
  bgColor,
  hasResume,
}: JobCardProps) {
  return (
    <div
      className="h-[180px] w-full cursor-pointer flex-col justify-between rounded-[30px] p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-full bg-white/60 px-3 py-1 backdrop-blur-sm">
          <span className="text-xs font-semibold text-[#1a1a1a]">{company}</span>
        </div>
        <div
          className={`rounded-full px-3 py-1 ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}
        >
          <span className="text-xs font-semibold">{status}</span>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <h3 className="line-clamp-2 text-lg font-semibold text-[#1a1a1a]">
          {position}
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <DollarSign size={16} className="text-[#1a1a1a]" />
          <span className="text-sm font-semibold text-[#1a1a1a]">{salary}</span>
        </div>
        {hasResume && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60">
            <Paperclip size={16} className="text-[#1a1a1a]" />
          </div>
        )}
      </div>
    </div>
  )
}
