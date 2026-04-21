import { Calendar, ClipboardList, MapPin, Pencil, Plus, Trash2, User, Video } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { formatInterviewDateTime } from '@/modules/interviews/utils/formatInterviewDateTime'
import { useAppState } from '@/state/AppStateContext'

import { EMPTY_DEBRIEF, type InterviewDebrief, type InterviewTimelineRecord } from '../../types'
import { InterviewDateTimePicker } from './InterviewDateTimePicker'
import { InterviewDebriefForm } from './InterviewDebriefForm'

function cloneDebrief(d: InterviewDebrief): InterviewDebrief {
  return {
    questions: d.questions.length ? [...d.questions] : [''],
    selfRating: d.selfRating,
    highlights: d.highlights.length ? [...d.highlights] : [''],
    improvements: d.improvements.length ? [...d.improvements] : [''],
    followUp: d.followUp,
    otherNotes: d.otherNotes,
  }
}

function normalizeDebrief(d: InterviewDebrief): InterviewDebrief {
  const trimLines = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean)
  return {
    questions: trimLines(d.questions),
    selfRating: Math.min(5, Math.max(1, Math.round(d.selfRating))),
    highlights: trimLines(d.highlights),
    improvements: trimLines(d.improvements),
    followUp: d.followUp.trim(),
    otherNotes: d.otherNotes.trim(),
  }
}

interface InterviewFormValues {
  jobId: string
  roundType: InterviewTimelineRecord['roundType']
  roundNumber: string
  status: InterviewTimelineRecord['status']
  scheduledAtLocal: string
  durationMinutes: string
  location: string
  meetingUrl: string
  interviewer: string
  remark: string
}

const ROUND_TYPES: InterviewTimelineRecord['roundType'][] = ['HR初筛', '技术面', '主管面', '总监面', 'HR终面', '群面', '案例面', '其他']
const STATUS_OPTIONS: InterviewTimelineRecord['status'][] = ['已安排', '已完成', '已取消', '已改期']
const HIGHLIGHT_DURATION_MS = 2400

interface InterviewFocusRequest {
  jobId: number
  company?: string
  token: number
}

interface InterviewTimelineProps {
  focusRequest?: InterviewFocusRequest | null
}

function toLocalInputValue(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const timezoneOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function toIsoFromLocalInput(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function toInterviewForm(record: InterviewTimelineRecord | null): InterviewFormValues {
  return {
    jobId: record ? String(record.jobId) : '',
    roundType: record?.roundType ?? 'HR初筛',
    roundNumber: record ? String(record.roundNumber) : '1',
    status: record?.status ?? '已安排',
    scheduledAtLocal: toLocalInputValue(record?.scheduledAt),
    durationMinutes: record ? String(record.durationMinutes) : '60',
    location: record?.location ?? '',
    meetingUrl: record?.meetingUrl ?? '',
    interviewer: record?.interviewer ?? '',
    remark: record?.remark ?? '',
  }
}

function statusBadgeClass(status: InterviewTimelineRecord['status']) {
  switch (status) {
    case '已安排':
      return 'border-blue-200 bg-blue-50 text-blue-800'
    case '已完成':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    case '已取消':
      return 'border-zinc-200 bg-zinc-100 text-zinc-700'
    case '已改期':
      return 'border-amber-200 bg-amber-50 text-amber-900'
    default:
      return ''
  }
}

export function InterviewTimeline({ focusRequest = null }: InterviewTimelineProps) {
  const { jobs, settings, setSettings, interviews: records, setInterviews: setRecords } = useAppState()
  const [debriefSheetOpen, setDebriefSheetOpen] = useState(false)
  const [editorSheetOpen, setEditorSheetOpen] = useState(false)
  const [activeDebriefId, setActiveDebriefId] = useState<string | null>(null)
  const [inlineDebriefId, setInlineDebriefId] = useState<string | null>(null)
  const [inlineDebriefDraft, setInlineDebriefDraft] = useState({
    highlights: '',
    improvements: '',
    followUp: '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [debriefDraft, setDebriefDraft] = useState<InterviewDebrief>(cloneDebrief(EMPTY_DEBRIEF))
  const [formValues, setFormValues] = useState<InterviewFormValues>(toInterviewForm(null))
  const [formError, setFormError] = useState('')
  const recordRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const questionBank = useMemo(
    () =>
      Array.isArray(settings.interviewQuestionBank)
        ? settings.interviewQuestionBank.map((item) => String(item)).filter(Boolean)
        : [],
    [settings.interviewQuestionBank]
  )
  const interviewingJobs = useMemo(
    () => jobs.filter((job) => job.status === '面试中'),
    [jobs]
  )

  const sorted = useMemo(
    () => [...records].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [records]
  )

  useEffect(() => {
    if (!focusRequest || sorted.length === 0) return
    const targetByJob = sorted.find((record) => record.jobId === focusRequest.jobId)
    const target =
      targetByJob ??
      (focusRequest.company
        ? sorted.find((record) => record.company.trim() === focusRequest.company?.trim())
        : undefined)
    if (!target) return
    const el = recordRefs.current[target.id]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightedId(target.id)
    const timer = window.setTimeout(() => {
      setHighlightedId((current) => (current === target.id ? null : current))
    }, HIGHLIGHT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [focusRequest, sorted])

  const activeRecord = activeDebriefId ? records.find((r) => r.id === activeDebriefId) : undefined
  const editingRecord = editingId ? records.find((r) => r.id === editingId) : undefined
  const selectableJobs = useMemo(() => {
    if (!editingRecord) return interviewingJobs
    const alreadyIncluded = interviewingJobs.some((job) => job.id === editingRecord.jobId)
    if (alreadyIncluded) return interviewingJobs
    const linkedJob = jobs.find((job) => job.id === editingRecord.jobId)
    return linkedJob ? [linkedJob, ...interviewingJobs] : interviewingJobs
  }, [editingRecord, interviewingJobs, jobs])

  const openDebrief = (record: InterviewTimelineRecord) => {
    setActiveDebriefId(record.id)
    setDebriefDraft(cloneDebrief(record.debrief ?? EMPTY_DEBRIEF))
    setDebriefSheetOpen(true)
  }

  const openInlineDebrief = (record: InterviewTimelineRecord) => {
    setInlineDebriefId(record.id)
    setInlineDebriefDraft({
      highlights: record.debrief?.highlights?.[0] ?? '',
      improvements: record.debrief?.improvements?.[0] ?? '',
      followUp: record.debrief?.followUp ?? '',
    })
  }

  const openCreateEditor = () => {
    setEditingId(null)
    setFormValues(toInterviewForm(null))
    setFormError('')
    setEditorSheetOpen(true)
  }

  const openEditEditor = (record: InterviewTimelineRecord) => {
    setEditingId(record.id)
    setFormValues(toInterviewForm(record))
    setFormError('')
    setEditorSheetOpen(true)
  }

  const updateField = (key: keyof InterviewFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const saveInterviewRecord = () => {
    setFormError('')
    if (!editingRecord && interviewingJobs.length === 0) {
      setFormError('暂无“面试中”岗位，请先在岗位管理推进状态后再新增面试记录。')
      return
    }
    const jobId = Number.parseInt(formValues.jobId, 10)
    const linkedJob = jobs.find((job) => job.id === jobId)
    if (!linkedJob) {
      setFormError('请选择要关联的岗位。')
      return
    }
    const canUseSelectedJob =
      linkedJob.status === '面试中' || (editingRecord ? linkedJob.id === editingRecord.jobId : false)
    if (!canUseSelectedJob) {
      setFormError('仅可关联“面试中”的岗位。请先在岗位管理中更新岗位状态。')
      return
    }
    const roundNumber = Number.parseInt(formValues.roundNumber, 10)
    if (Number.isNaN(roundNumber) || roundNumber < 1) {
      setFormError('轮次需为大于等于 1 的数字。')
      return
    }
    const durationMinutes = Number.parseInt(formValues.durationMinutes, 10)
    if (Number.isNaN(durationMinutes) || durationMinutes < 1) {
      setFormError('面试时长需为大于等于 1 的数字。')
      return
    }
    const scheduledAt = toIsoFromLocalInput(formValues.scheduledAtLocal)
    if (!scheduledAt) {
      setFormError('请填写有效的面试时间。')
      return
    }

    const base: InterviewTimelineRecord = {
      id:
        editingRecord?.id ??
        (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `int-${Date.now()}`),
      jobId: linkedJob.id,
      company: linkedJob.company,
      jobTitle: linkedJob.position,
      roundType: formValues.roundType,
      roundNumber,
      status: formValues.status,
      scheduledAt,
      durationMinutes,
      location: formValues.location.trim() || undefined,
      meetingUrl: formValues.meetingUrl.trim() || undefined,
      interviewer: formValues.interviewer.trim() || undefined,
      remark: formValues.remark.trim() || undefined,
      debrief: editingRecord?.debrief,
    }

    if (editingRecord) {
      setRecords((prev) => prev.map((item) => (item.id === editingRecord.id ? base : item)))
    } else {
      setRecords((prev) => [...prev, base])
    }
    setEditorSheetOpen(false)
  }

  const saveDebrief = () => {
    if (!activeDebriefId) return
    const normalized = normalizeDebrief(debriefDraft)
    setRecords((prev) =>
      prev.map((r) => (r.id === activeDebriefId ? { ...r, debrief: normalized } : r))
    )
    if (normalized.questions.length > 0) {
      setSettings((prev) => ({
        ...prev,
        interviewQuestionBank: Array.from(
          new Set([...(prev.interviewQuestionBank ?? []), ...normalized.questions])
        ).slice(-200),
      }))
    }
    setDebriefSheetOpen(false)
    setActiveDebriefId(null)
  }

  const deleteInterviewRecord = (id: string) => {
    if (!window.confirm('确定删除该面试记录吗？')) return
    setRecords((prev) => prev.filter((item) => item.id !== id))
  }

  const saveInlineDebrief = (record: InterviewTimelineRecord) => {
    const nextDebrief: InterviewDebrief = {
      questions: record.debrief?.questions?.length ? record.debrief.questions : [''],
      selfRating: record.debrief?.selfRating ?? 3,
      highlights: inlineDebriefDraft.highlights.trim() ? [inlineDebriefDraft.highlights.trim()] : [],
      improvements: inlineDebriefDraft.improvements.trim() ? [inlineDebriefDraft.improvements.trim()] : [],
      followUp: inlineDebriefDraft.followUp.trim(),
      otherNotes: record.debrief?.otherNotes ?? '',
    }
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, debrief: nextDebrief } : r)))
    setInlineDebriefId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-[#1a1a1a]">面试安排 · 时间线</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#666666]">按预约时间排序</span>
          <Button type="button" size="sm" className="rounded-full" onClick={openCreateEditor}>
            <Plus className="size-4" />
            新增面试
          </Button>
        </div>
      </div>

      <div className="relative pl-4">
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-[#ddd6cc]" aria-hidden />

        <ul className="space-y-4">
          {sorted.length === 0 ? (
            <li className="rounded-[20px] border border-dashed border-[#ddd6cc] bg-white p-4 text-sm text-[#666666]">
              暂无面试记录。点击右上角「新增面试」开始安排。
            </li>
          ) : null}
          {sorted.map((item) => (
            <li
              key={item.id}
              className="relative pl-6"
              ref={(node) => {
                recordRefs.current[item.id] = node
              }}
              data-interview-id={item.id}
            >
              <span
                className="absolute left-0 top-3 size-2 rounded-full border-2 border-[#f4f2ee] bg-[#1a1a1a]"
                aria-hidden
              />
              <div
                className={`rounded-[20px] border border-[#e8e6e2] bg-white p-4 shadow-sm transition ${
                  highlightedId === item.id
                    ? 'ring-2 ring-emerald-500/70 ring-offset-2 ring-offset-[#fbfaf8]'
                    : ''
                }`}
              >
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-[#1a1a1a]">{item.company}</div>
                    <div className="text-xs text-[#666666]">{item.jobTitle}</div>
                  </div>
                  <Badge variant="outline" className={statusBadgeClass(item.status)}>
                    {item.status}
                  </Badge>
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#666666]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5 shrink-0" />
                    {formatInterviewDateTime(item.scheduledAt)}
                  </span>
                  <span>{item.durationMinutes} 分钟</span>
                  <span>
                    {item.roundType} · 第 {item.roundNumber} 轮
                  </span>
                </div>

                {(item.interviewer || item.location || item.meetingUrl) && (
                  <div className="mb-2 space-y-1 text-xs text-[#666666]">
                    {item.interviewer ? (
                      <div className="flex items-center gap-1">
                        <User className="size-3.5 shrink-0" />
                        {item.interviewer}
                      </div>
                    ) : null}
                    {item.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 shrink-0" />
                        {item.location}
                      </div>
                    ) : null}
                    {item.meetingUrl ? (
                      <div className="flex items-center gap-1 truncate">
                        <Video className="size-3.5 shrink-0" />
                        <a href={item.meetingUrl} className="truncate text-blue-700 underline" target="_blank" rel="noreferrer">
                          会议链接
                        </a>
                      </div>
                    ) : null}
                  </div>
                )}

                {item.remark ? <p className="mb-2 text-xs text-[#888888]">备注：{item.remark}</p> : null}

                {item.debrief && item.debrief.questions.length > 0 ? (
                  <p className="mb-2 text-xs text-emerald-700">已填写复盘 · 自我评分 {item.debrief.selfRating}/5</p>
                ) : null}

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-1 w-full rounded-full bg-[#f4f2ee] text-[#1a1a1a] hover:bg-[#e8e6e2]"
                  onClick={() => openDebrief(item)}
                >
                  <ClipboardList className="size-4" />
                  {item.debrief ? '编辑复盘' : '面试复盘'}
                </Button>
                {inlineDebriefId === item.id ? (
                  <div className="mt-2 space-y-2 rounded-xl bg-[#fbfaf8] p-3">
                    <Label className="text-xs text-[#666666]">亮点</Label>
                    <Textarea
                      rows={2}
                      value={inlineDebriefDraft.highlights}
                      onChange={(e) =>
                        setInlineDebriefDraft((prev) => ({ ...prev, highlights: e.target.value }))
                      }
                      className="rounded-xl border-[#e8e6e2] bg-white"
                    />
                    <Label className="text-xs text-[#666666]">问题</Label>
                    <Textarea
                      rows={2}
                      value={inlineDebriefDraft.improvements}
                      onChange={(e) =>
                        setInlineDebriefDraft((prev) => ({ ...prev, improvements: e.target.value }))
                      }
                      className="rounded-xl border-[#e8e6e2] bg-white"
                    />
                    <Label className="text-xs text-[#666666]">下一步</Label>
                    <Textarea
                      rows={2}
                      value={inlineDebriefDraft.followUp}
                      onChange={(e) =>
                        setInlineDebriefDraft((prev) => ({ ...prev, followUp: e.target.value }))
                      }
                      className="rounded-xl border-[#e8e6e2] bg-white"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-full"
                        onClick={() => saveInlineDebrief(item)}
                      >
                        保存最小复盘
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setInlineDebriefId(null)}
                      >
                        收起
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-[#1a1a1a] underline underline-offset-2"
                    onClick={() => openInlineDebrief(item)}
                  >
                    当场快速复盘（亮点/问题/下一步）
                  </button>
                )}
                <div className="mt-2 flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="flex-1 rounded-full" onClick={() => openEditEditor(item)}>
                    <Pencil className="size-4" />
                    编辑记录
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1 rounded-full text-red-600 hover:text-red-700" onClick={() => deleteInterviewRecord(item.id)}>
                    <Trash2 className="size-4" />
                    删除
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Sheet open={editorSheetOpen} onOpenChange={setEditorSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingRecord ? '编辑面试记录' : '新增面试记录'}</SheetTitle>
            <SheetDescription>填写 PRD 3.5.3 面试信息字段，并关联岗位（jobId）。</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 pb-8">
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            <div>
              <Label className="mb-1 block text-[#666666]">关联岗位 *</Label>
              {interviewingJobs.length === 0 ? (
                <p className="mb-2 text-xs text-amber-700">
                  暂无“面试中”岗位，请先在岗位管理推进状态后再新增面试记录。
                </p>
              ) : null}
              <select
                value={formValues.jobId}
                onChange={(e) => updateField('jobId', e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
              >
                <option value="">
                  {interviewingJobs.length === 0 ? '暂无面试中岗位' : '请选择岗位'}
                </option>
                {selectableJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.company} · {job.position}
                    {job.status !== '面试中' ? '（当前已关联，状态非面试中）' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block text-[#666666]">面试类型 *</Label>
                <select
                  value={formValues.roundType}
                  onChange={(e) => updateField('roundType', e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
                >
                  {ROUND_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1 block text-[#666666]">状态 *</Label>
                <select
                  value={formValues.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1 block text-[#666666]">轮次 *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formValues.roundNumber}
                  onChange={(e) => updateField('roundNumber', e.target.value)}
                  className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
                />
              </div>
              <div>
                <Label className="mb-1 block text-[#666666]">时长（分钟）*</Label>
                <Input
                  type="number"
                  min={1}
                  value={formValues.durationMinutes}
                  onChange={(e) => updateField('durationMinutes', e.target.value)}
                  className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block text-[#666666]">面试时间 *</Label>
              <InterviewDateTimePicker
                value={formValues.scheduledAtLocal}
                onChange={(nextValue) => updateField('scheduledAtLocal', nextValue)}
              />
            </div>
            <div>
              <Label className="mb-1 block text-[#666666]">面试官</Label>
              <Input
                value={formValues.interviewer}
                onChange={(e) => updateField('interviewer', e.target.value)}
                placeholder="如 张三 · 技术经理"
                className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
              />
            </div>
            <div>
              <Label className="mb-1 block text-[#666666]">地点</Label>
              <Input
                value={formValues.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="线下面试地址 / 视频平台"
                className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
              />
            </div>
            <div>
              <Label className="mb-1 block text-[#666666]">会议链接</Label>
              <Input
                type="url"
                value={formValues.meetingUrl}
                onChange={(e) => updateField('meetingUrl', e.target.value)}
                placeholder="https://"
                className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
              />
            </div>
            <div>
              <Label className="mb-1 block text-[#666666]">备注</Label>
              <Textarea
                rows={3}
                value={formValues.remark}
                onChange={(e) => updateField('remark', e.target.value)}
                className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
              />
            </div>
            <Button type="button" className="rounded-full" onClick={saveInterviewRecord}>
              保存面试记录
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={debriefSheetOpen} onOpenChange={setDebriefSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>面试复盘</SheetTitle>
            <SheetDescription>
              {activeRecord
                ? `${activeRecord.company} · ${activeRecord.roundType}（第 ${activeRecord.roundNumber} 轮）`
                : ''}
            </SheetDescription>
          </SheetHeader>
          {activeRecord ? (
            <div className="flex flex-col gap-4 pb-8">
              <InterviewDebriefForm
                value={debriefDraft}
                onChange={setDebriefDraft}
                questionBank={questionBank}
              />
              <Button type="button" className="rounded-full" onClick={saveDebrief}>
                保存复盘
              </Button>
              <p className="text-xs text-[#888888]">保存后写入本条面试的复盘信息；面试状态请在安排侧单独维护。</p>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
