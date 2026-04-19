import { Phone, Video } from 'lucide-react'

interface Interview {
  id: number
  company: string
  time: string
  type: 'video' | 'phone'
  bgColor: string
}

const interviews: Interview[] = [
  { id: 1, company: 'Google', time: '今天 14:00', type: 'video', bgColor: '#fadcd9' },
  { id: 2, company: 'Microsoft', time: '明天 10:30', type: 'phone', bgColor: '#dcd6f7' },
  { id: 3, company: 'Meta', time: '周三 15:00', type: 'video', bgColor: '#c8e8d5' },
  { id: 4, company: 'Apple', time: '周五 11:00', type: 'video', bgColor: '#fbe0c3' },
]

export function InterviewList() {
  return (
    <div className="space-y-3">
      <h4 className="mb-3 text-sm font-semibold text-[#1a1a1a]">近期面试</h4>
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="flex items-center justify-between rounded-[20px] p-4"
          style={{ backgroundColor: interview.bgColor }}
        >
          <div>
            <div className="text-sm font-semibold text-[#1a1a1a]">
              {interview.company}
            </div>
            <div className="mt-0.5 text-xs text-[#666666]">{interview.time}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60">
            {interview.type === 'video' ? (
              <Video size={18} className="text-[#1a1a1a]" />
            ) : (
              <Phone size={18} className="text-[#1a1a1a]" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
