import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { AddJobModal } from './modules/jobs'
import { ChartWidget } from './modules/jobs'
import { FilterPill } from './modules/jobs'
import { InterviewList } from './modules/jobs'
import { JobCard } from './modules/jobs'
import { JobsSidebar } from './modules/jobs'
import { StatsWidget } from './modules/jobs'
import { UserInfo } from './modules/jobs'

const filters = [
  { label: '全部', count: 24 },
  { label: '待投递', count: 5 },
  { label: '已投递', count: 4 },
  { label: '筛选中', count: 8 },
  { label: '面试中', count: 8 },
  { label: 'Offer', count: 3 },
]

const jobs = [
  { id: 1, company: 'Google', position: 'Senior Product Manager', salary: '150-200K', status: '面试中', bgColor: '#fadcd9', hasResume: true },
  { id: 2, company: 'Microsoft', position: 'Product Manager', salary: '120-180K', status: '筛选中', bgColor: '#dcd6f7', hasResume: true },
  { id: 3, company: 'Meta', position: 'Product Lead', salary: '180-250K', status: 'Offer', bgColor: '#c8e8d5', hasResume: true },
  { id: 4, company: 'Apple', position: 'Product Manager', salary: '140-190K', status: '面试中', bgColor: '#fbe0c3', hasResume: false },
  { id: 5, company: 'Amazon', position: 'Senior PM - AWS', salary: '160-220K', status: '待投递', bgColor: '#c5e1a5', hasResume: true },
  { id: 6, company: 'Netflix', position: 'Product Manager', salary: '150-200K', status: '筛选中', bgColor: '#fadcd9', hasResume: true },
  { id: 7, company: 'Tesla', position: 'Product Manager', salary: '130-170K', status: '面试中', bgColor: '#dcd6f7', hasResume: false },
  { id: 8, company: 'Airbnb', position: 'Senior Product Manager', salary: '160-210K', status: 'Offer', bgColor: '#c8e8d5', hasResume: true },
  { id: 9, company: 'Uber', position: 'Product Manager', salary: '140-180K', status: '筛选中', bgColor: '#fbe0c3', hasResume: true },
]

export default function App() {
  const [activeFilter, setActiveFilter] = useState('全部')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredJobs = useMemo(() => {
    if (activeFilter === '全部') return jobs
    return jobs.filter((job) => job.status === activeFilter)
  }, [activeFilter])

  return (
    <div className="flex size-full bg-[#fbfaf8]">
      <JobsSidebar />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#333333]"
      >
        <Plus size={24} />
      </button>

      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex-1 overflow-auto p-8">
        <div className="mb-6">
          <h1 className="mb-6 text-[42px] font-bold text-[#1a1a1a]">
            Track your job applications
          </h1>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <FilterPill
                key={filter.label}
                label={filter.label}
                count={filter.count}
                active={activeFilter === filter.label}
                onClick={() => setActiveFilter(filter.label)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>

      <div className="w-[340px] overflow-auto rounded-l-[30px] bg-[#f4f2ee] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <UserInfo />
        <div className="space-y-5">
          <StatsWidget />
          <ChartWidget />
          <InterviewList />
        </div>
      </div>
    </div>
  )
}
