import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { OAuthCallbackPage } from './modules/auth'
import { useAppState } from './state/AppStateContext'
import {
  AddJobModal,
  FilterPill,
  getAllowedStatusOptions,
  InterviewList,
  isStatusTransitionAllowed,
  JobCard,
  JOB_STATUSES,
  JobsSidebar,
  type JobsAppSection,
  StatisticsPanel,
  StatsWidget,
  UserInfo,
  type JobItem,
  type JobStatus,
} from './modules/jobs'
import { InterviewTimeline, useInterviewReminder } from './modules/interviews'
import { ResumeManager } from './modules/resumes'
import { SettingsPanel } from './modules/settings/components'
import { normalizeAppSettings } from './modules/settings/utils'

type SortKey = 'appliedAt' | 'company' | 'priority'
interface InterviewFocusRequest {
  jobId: number
  company?: string
  token: number
}

export default function App() {
  const { jobs, interviews, settings, setJobs, setInterviews } = useAppState()
  const isOAuthCallback =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('auth_callback') === '1'

  const appSettings = normalizeAppSettings(settings)
  const [section, setSection] = useState<JobsAppSection>('dashboard')
  const [activeFilter, setActiveFilter] = useState('全部')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDraftJob, setModalDraftJob] = useState<JobItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('appliedAt')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [interviewFocusRequest, setInterviewFocusRequest] = useState<InterviewFocusRequest | null>(null)
  useInterviewReminder(interviews)

  useEffect(() => {
    const root = document.documentElement
    const isDark =
      appSettings.theme === 'dark' ||
      (appSettings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [appSettings.theme])

  const handleStatusChange = (jobId: number, status: string) => {
    if (!JOB_STATUSES.includes(status as JobStatus)) return

    setJobs((currentJobs) =>
      currentJobs.map((job) => {
        if (job.id !== jobId) return job
        const nextStatus = status as JobStatus
        if (!isStatusTransitionAllowed(job.status, nextStatus)) {
          window.alert(`无法从「${job.status}」直接变更为「${nextStatus}」，请按流程调整。`)
          return job
        }
        let appliedAt = job.appliedAt
        if (nextStatus === '待投递') {
          appliedAt = undefined
        } else if (job.status === '待投递') {
          appliedAt = new Date().toISOString().slice(0, 10)
        }
        const history = [...(job.statusHistory ?? [])]
        if (job.status !== nextStatus) {
          history.push({ at: new Date().toISOString(), from: job.status, to: nextStatus })
        }
        return {
          ...job,
          status: nextStatus,
          appliedAt,
          statusHistory: history.length > 0 ? history : undefined,
        }
      })
    )
  }

  const filters = useMemo(
    () => [
      { label: '全部', count: jobs.length },
      ...JOB_STATUSES.map((status) => ({
        label: status,
        count: jobs.filter((job) => job.status === status).length,
      })),
    ],
    [jobs]
  )

  const displayJobs = useMemo(() => {
    let list = activeFilter === '全部' ? [...jobs] : jobs.filter((job) => job.status === activeFilter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (job) =>
          job.company.toLowerCase().includes(q) || job.position.toLowerCase().includes(q)
      )
    }
    if (dateFrom) {
      list = list.filter((job) => job.appliedAt && job.appliedAt >= dateFrom)
    }
    if (dateTo) {
      list = list.filter((job) => job.appliedAt && job.appliedAt <= dateTo)
    }
    list.sort((a, b) => {
      if (sortBy === 'company') return a.company.localeCompare(b.company, 'zh-CN')
      if (sortBy === 'priority') return (b.priority ?? 0) - (a.priority ?? 0)
      return (b.appliedAt ?? '').localeCompare(a.appliedAt ?? '')
    })
    return list
  }, [jobs, activeFilter, search, dateFrom, dateTo, sortBy])

  const openAddModal = () => {
    setModalDraftJob(null)
    setIsModalOpen(true)
  }

  const openEditModal = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      setModalDraftJob(job)
      setIsModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (deleteId == null) return
    setJobs((prev) => prev.filter((j) => j.id !== deleteId))
    setInterviews((prev) => prev.filter((item) => item.jobId !== deleteId))
    setDeleteId(null)
  }

  const jobToDelete = deleteId != null ? jobs.find((j) => j.id === deleteId) : undefined
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)

  const handleRecommendedAction = (jobId: number, status: string) => {
    if (status === '待投递') {
      handleStatusChange(jobId, '已投递')
      return
    }
    if (status === '面试中') {
      const job = jobs.find((item) => item.id === jobId)
      setInterviewFocusRequest({
        jobId,
        company: job?.company,
        token: Date.now(),
      })
      setSection('interviews')
      return
    }
    if (status === '已投递' || status === '筛选中') {
      openEditModal(jobId)
      return
    }
    if (status === 'Offer') {
      window.alert('建议尽快记录谈薪计划与入职时间。')
    }
  }

  const rightSidebarContent = (
    <>
      <UserInfo />
      <div className="space-y-5">
        <StatsWidget jobs={jobs} />
        <StatisticsPanel jobs={jobs} interviews={interviews} />
        <Tabs defaultValue="recent" className="w-full gap-3">
          <TabsList className="h-9 w-full shrink-0 bg-white/90 p-1 dark:bg-[#2a2a2a]">
            <TabsTrigger value="recent" className="flex-1 rounded-full px-2 py-1 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              近期
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 rounded-full px-2 py-1 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
              时间线
            </TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="mt-0">
            <InterviewList />
          </TabsContent>
          <TabsContent value="timeline" className="mt-0">
            <InterviewTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )

  if (isOAuthCallback) {
    return <OAuthCallbackPage />
  }

  return (
    <>
      <div className="flex size-full bg-[#fbfaf8] text-[#1a1a1a] dark:bg-[#151515] dark:text-[#f5f5f5]">
        <JobsSidebar activeSection={section} onSectionChange={setSection} />

        {section === 'jobs' ? (
          <button
            type="button"
            onClick={openAddModal}
            className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#333333]"
          >
            <Plus size={24} />
          </button>
        ) : null}

        <AddJobModal
          isOpen={isModalOpen}
          draftJob={modalDraftJob}
          onClose={() => {
            setIsModalOpen(false)
            setModalDraftJob(null)
          }}
        />

        {section === 'dashboard' ? (
          <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <div>
                <h1 className="text-[36px] font-bold text-[#1a1a1a] dark:text-[#f5f5f5]">首页看板</h1>
                <p className="mt-2 text-sm text-[#666666] dark:text-[#b8b8b8]">
                  关注投递漏斗、状态分布和近期面试动态，快速掌握求职进度。
                </p>
              </div>
              <StatsWidget jobs={jobs} />
              <StatisticsPanel jobs={jobs} interviews={interviews} />
              {jobs.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#ddd7cf] bg-white p-5 dark:border-[#3a3a3a] dark:bg-[#1f1f1f]">
                  <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">
                    还没有岗位数据
                  </h3>
                  <p className="mt-2 text-sm text-[#666666] dark:text-[#b8b8b8]">
                    先新增 1 条岗位记录，系统会自动开始统计投递与面试进展。
                  </p>
                  <button
                    type="button"
                    onClick={() => setSection('jobs')}
                    className="mt-4 rounded-full bg-[#1a1a1a] px-5 py-2 text-sm text-white transition hover:bg-[#333333]"
                  >
                    去岗位管理新增
                  </button>
                </div>
              ) : null}
              <div className="rounded-[20px] bg-white p-5 dark:bg-[#1f1f1f]">
                <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">面试速览</h3>
                <Tabs defaultValue="recent" className="w-full gap-3">
                  <TabsList className="h-9 w-full shrink-0 bg-[#f4f2ee] p-1 dark:bg-[#2a2a2a]">
                    <TabsTrigger value="recent" className="flex-1 rounded-full px-2 py-1 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
                      近期
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="flex-1 rounded-full px-2 py-1 text-xs data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white">
                      时间线
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="mt-0">
                    <InterviewList />
                  </TabsContent>
                  <TabsContent value="timeline" className="mt-0">
                    <InterviewTimeline />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        ) : section === 'jobs' ? (
          <div className="flex-1 overflow-auto p-8">
            <div className="mb-6">
              <h1 className="mb-6 text-[42px] font-bold text-[#1a1a1a] dark:text-[#f5f5f5]">
                为者常成，行者常至。
              </h1>
              <div className="mb-4 flex flex-wrap gap-3">
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

              <div className="mb-4 rounded-[20px] bg-white/80 p-4 dark:bg-[#1f1f1f]">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[200px] flex-1">
                    <label className="mb-1 block text-xs font-medium text-[#666666] dark:text-[#b8b8b8]">搜索</label>
                    <input
                      type="search"
                      placeholder="公司或职位"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-full border-none bg-[#f4f2ee] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 dark:bg-[#2a2a2a] dark:text-[#f5f5f5] dark:focus:ring-[#f5f5f5]/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters((prev) => !prev)}
                    className="rounded-full border border-[#dfddd8] px-4 py-2 text-sm text-[#555555] transition hover:bg-[#f4f2ee] dark:border-[#3a3a3a] dark:text-[#b8b8b8] dark:hover:bg-[#2a2a2a]"
                  >
                    {showAdvancedFilters ? '收起高级筛选' : '高级筛选'}
                  </button>
                </div>
                {showAdvancedFilters ? (
                  <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-[#efede8] pt-3 dark:border-[#2f2f2f]">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[#666666] dark:text-[#b8b8b8]">投递日从</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="rounded-full border-none bg-[#f4f2ee] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 dark:bg-[#2a2a2a] dark:text-[#f5f5f5] dark:focus:ring-[#f5f5f5]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[#666666] dark:text-[#b8b8b8]">到</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="rounded-full border-none bg-[#f4f2ee] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 dark:bg-[#2a2a2a] dark:text-[#f5f5f5] dark:focus:ring-[#f5f5f5]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-[#666666] dark:text-[#b8b8b8]">排序</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortKey)}
                        className="block cursor-pointer rounded-full border-none bg-[#f4f2ee] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 dark:bg-[#2a2a2a] dark:text-[#f5f5f5] dark:focus:ring-[#f5f5f5]/20"
                      >
                        <option value="appliedAt">投递日（新→旧）</option>
                        <option value="company">公司名 A→Z</option>
                        <option value="priority">优先级（高→低）</option>
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {displayJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                  id={job.id}
                  statusOptions={getAllowedStatusOptions(job.status)}
                  onStatusChange={handleStatusChange}
                  onEdit={openEditModal}
                  onDelete={(id) => setDeleteId(id)}
                  onRecommendedAction={handleRecommendedAction}
                />
              ))}
            </div>
          </div>
        ) : section === 'resumes' ? (
          <div className="flex-1 overflow-auto p-8">
            <ResumeManager />
          </div>
        ) : section === 'interviews' ? (
          <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-6xl space-y-5">
              <div>
                <h1 className="text-[36px] font-bold text-[#1a1a1a] dark:text-[#f5f5f5]">面试管理</h1>
                <p className="mt-2 text-sm text-[#666666] dark:text-[#b8b8b8]">
                  查看面试时间线、跟进状态并维护复盘记录。
                </p>
              </div>
              <InterviewTimeline focusRequest={interviewFocusRequest} />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-8">
            <SettingsPanel />
          </div>
        )}

        {section === 'jobs' ? (
          <div className="hidden w-[340px] overflow-auto rounded-l-[30px] bg-[#f4f2ee] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:bg-[#1f1f1f] dark:shadow-none xl:block">
            {rightSidebarContent}
          </div>
        ) : null}
      </div>
      {section === 'jobs' ? (
        <div className="fixed bottom-8 left-24 z-40 xl:hidden">
          <Sheet open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="rounded-full bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-white shadow-lg"
              >
                查看侧边信息
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[92vw] max-w-sm overflow-y-auto bg-[#f4f2ee] p-4 dark:bg-[#1f1f1f]">
              <SheetHeader>
                <SheetTitle>岗位侧边信息</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">{rightSidebarContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      ) : null}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[24px]">
          <AlertDialogHeader>
            <AlertDialogTitle>删除岗位</AlertDialogTitle>
            <AlertDialogDescription>
              确定删除「{jobToDelete?.company} · {jobToDelete?.position}」？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">取消</AlertDialogCancel>
            <AlertDialogCancel
              type="button"
              className="text-red-600 hover:text-red-600"
              onClick={confirmDelete}
            >
              删除
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
