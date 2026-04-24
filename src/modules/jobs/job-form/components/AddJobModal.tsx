import { Loader2, Sparkles, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Label } from '@/components/ui/label'
import { parseJobScreenshotWithAI, ScreenshotUploader } from '@/modules/screenshot'
import { useAppState } from '@/state/AppStateContext'

import { getAllowedStatusOptions, isStatusTransitionAllowed } from '../../domain/job-status-rules'
import type { JobItem, JobStatus, WorkMode, WorkType } from '../../types'
import { buildJobItemFromForm, emptyJobForm, jobToFormValues, pickJobBgColor, type JobFormValues } from '../job-form-map'

interface AddJobModalProps {
 isOpen: boolean
 draftJob: JobItem | null
 onClose: () => void
}

const WORK_TYPES: WorkType[] = ['全职', '实习', '兼职', '合同工']
const WORK_MODES: WorkMode[] = ['现场', '远程', '混合']

export function AddJobModal({ isOpen, draftJob, onClose }: AddJobModalProps) {
 const { jobs, resumes, setJobs } = useAppState()
 const [formValues, setFormValues] = useState<JobFormValues>(emptyJobForm)
 const [quickMode, setQuickMode] = useState(true)
 const [imageDataUrl, setImageDataUrl] = useState('')
 const [isParsing, setIsParsing] = useState(false)
 const [parseError, setParseError] = useState('')
 const [formError, setFormError] = useState('')
 const defaultResumeId = resumes.find((r) => r.isDefault)?.id ?? ''
 const recommendedResumeId = useMemo(() => {
 const title = formValues.position.trim().toLowerCase()
 const roleHint = `${formValues.workType} ${formValues.position}`.toLowerCase()
 const matched = resumes.find((resume) =>
 resume.targetRoles.some((role) => {
 const r = role.toLowerCase()
 return title.includes(r) || roleHint.includes(r)
 })
 )
 return matched?.id ?? defaultResumeId
 }, [formValues.position, formValues.workType, resumes, defaultResumeId])

 useEffect(() => {
 if (!isOpen) return
 setQuickMode(!draftJob)
 setFormError('')
 setParseError('')
 setImageDataUrl('')
 if (draftJob) {
 const next = jobToFormValues(draftJob)
 const hasLinked = next.linkedResumeId && resumes.some((r) => r.id === next.linkedResumeId)
 setFormValues({
 ...next,
 linkedResumeId: hasLinked ? next.linkedResumeId : defaultResumeId,
 })
 } else {
 setFormValues({
 ...emptyJobForm,
 linkedResumeId: defaultResumeId,
 status: '待投递',
 })
 }
 }, [isOpen, draftJob, defaultResumeId, resumes])

 useEffect(() => {
 if (!isOpen || draftJob) return
 setFormValues((current) => {
 if (current.linkedResumeId) return current
 return { ...current, linkedResumeId: recommendedResumeId }
 })
 }, [isOpen, draftJob, recommendedResumeId])

 const updateField = (key: keyof JobFormValues, value: string) => {
 setFormValues((current) => ({ ...current, [key]: value }))
 }

 const statusOptions = getAllowedStatusOptions(formValues.status as JobStatus)

 const handleParseScreenshot = async () => {
 if (!imageDataUrl) {
 setParseError('请先上传招聘截图。')
 return
 }

 setParseError('')
 setIsParsing(true)
 try {
 const result = await parseJobScreenshotWithAI(imageDataUrl)
 setFormValues((current) => ({
 ...current,
 company: result.company || current.company,
 position: result.position || current.position,
 location: result.location || current.location,
 salary: result.salary || current.salary,
 description: result.description || current.description,
 requirements: result.requirements?.join('\n') || current.requirements,
 benefits: result.benefits?.join('\n') || current.benefits,
 }))
 } catch (error) {
 setParseError(error instanceof Error ? error.message : '识别失败，请稍后重试。')
 } finally {
 setIsParsing(false)
 }
 }

 const handleSave = () => {
 setFormError('')
 if (!formValues.company.trim() || !formValues.position.trim()) {
 setFormError('请填写公司名称与职位名称。')
 return
 }

 const fromStatus = draftJob?.status ?? '待投递'
 if (formValues.status !== fromStatus && !isStatusTransitionAllowed(fromStatus, formValues.status)) {
 setFormError('所选状态与当前流程不符，请按 PRD 状态路径调整。')
 return
 }

 const nextIdGuess = draftJob?.id ?? (jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1)
 const built = buildJobItemFromForm(draftJob, formValues, {
 bgColorForNew: pickJobBgColor(nextIdGuess),
 })

 if (draftJob) {
 setJobs((prev) => prev.map((j) => (j.id === built.id ? built : j)))
 } else {
 setJobs((prev) => [...prev, { ...built, id: nextIdGuess }])
 }
 onClose()
 }

 if (!isOpen) return null

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center">
 <div
 className="absolute inset-0 bg-black/20 backdrop-blur-sm"
 onClick={onClose}
 />

 <div className="relative max-h-[92vh] w-[880px] overflow-hidden rounded-[30px] bg-white shadow-2xl">
 <div className="flex items-center justify-between border-b border-gray-100 p-6">
 <h2 className="text-[24px] font-extrabold">{draftJob ? '编辑岗位' : '添加新岗位'}</h2>
 <button
 type="button"
 onClick={onClose}
 className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
 >
 <X size={20} />
 </button>
 </div>

 <div className="grid max-h-[calc(92vh-88px)] grid-cols-2 gap-6 overflow-hidden p-6">
 <div className="space-y-4 overflow-y-auto pr-1">
 <div>
 <h3 className="mb-3 text-[18px] font-semibold">智能识别</h3>
 <ScreenshotUploader
 disabled={isParsing}
 onFileReady={(_, dataUrl) => {
 setImageDataUrl(dataUrl)
 setParseError('')
 }}
 />

 <button
 type="button"
 onClick={() => void handleParseScreenshot()}
 disabled={isParsing || !imageDataUrl}
 className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1a1a] py-3 text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
 >
 {isParsing ? (
 <Loader2 size={18} className="animate-spin" />
 ) : (
 <Sparkles size={18} />
 )}
 <span className="font-semibold">
 {isParsing ? '识别中...' : parseError ? '重试解析' : 'AI 智能一键解析'}
 </span>
 </button>
 {parseError ? <p className="mt-2 text-xs text-red-500">{parseError}</p> : null}
 </div>
 </div>

 <div className="max-h-[calc(92vh-120px)] space-y-3 overflow-y-auto pr-2">
 <div className="mb-2 flex items-center justify-between">
 <h3 className="text-[18px] font-semibold">岗位信息</h3>
 {!draftJob ? (
 <button
 type="button"
 className="rounded-full border border-[#ddd6cc] px-3 py-1 text-xs text-[#666666] hover:bg-[#f4f2ee]"
 onClick={() => setQuickMode((prev) => !prev)}
 >
 {quickMode ? '展开高级字段' : '切回快速新增'}
 </button>
 ) : null}
 </div>
 {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

 <div className="grid grid-cols-2 gap-3">
 <div className="col-span-2">
 <Label className="text-[#666666]">公司名称 *</Label>
 <input
 type="text"
 value={formValues.company}
 onChange={(e) => updateField('company', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">职位名称 *</Label>
 <input
 type="text"
 value={formValues.position}
 onChange={(e) => updateField('position', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div>
 <Label className="text-[#666666]">工作类型</Label>
 <select
 value={formValues.workType}
 onChange={(e) => updateField('workType', e.target.value)}
 className="mt-1 w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 >
 {WORK_TYPES.map((t) => (
 <option key={t} value={t}>
 {t}
 </option>
 ))}
 </select>
 </div>
 <div>
 <Label className="text-[#666666]">工作模式</Label>
 <select
 value={formValues.workMode}
 onChange={(e) => updateField('workMode', e.target.value)}
 className="mt-1 w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 >
 {WORK_MODES.map((m) => (
 <option key={m} value={m}>
 {m}
 </option>
 ))}
 </select>
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">工作地点</Label>
 <input
 type="text"
 value={formValues.location}
 onChange={(e) => updateField('location', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 {!quickMode ? (
 <>
 <div>
 <Label className="text-[#666666]">薪资范围</Label>
 <input
 type="text"
 value={formValues.salary}
 onChange={(e) => updateField('salary', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div>
 <Label className="text-[#666666]">年薪月数</Label>
 <input
 type="number"
 min={1}
 placeholder="如 12"
 value={formValues.salaryMonths}
 onChange={(e) => updateField('salaryMonths', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 </>
 ) : null}
 <div>
 <Label className="text-[#666666]">优先级 1–5</Label>
 <select
 value={formValues.priority}
 onChange={(e) => updateField('priority', e.target.value)}
 className="mt-1 w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 >
 {[1, 2, 3, 4, 5].map((n) => (
 <option key={n} value={String(n)}>
 {n}
 </option>
 ))}
 </select>
 </div>
 <div>
 <Label className="text-[#666666]">投递状态</Label>
 <select
 value={formValues.status}
 onChange={(e) => updateField('status', e.target.value as JobStatus)}
 className="mt-1 w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 >
 {statusOptions.map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">来源渠道</Label>
 <input
 type="text"
 placeholder="如 BOSS / 官网"
 value={formValues.sourceChannel}
 onChange={(e) => updateField('sourceChannel', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">来源链接</Label>
 <input
 type="url"
 placeholder="https://"
 value={formValues.sourceUrl}
 onChange={(e) => updateField('sourceUrl', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">关联简历</Label>
 <select
 value={formValues.linkedResumeId}
 onChange={(e) => updateField('linkedResumeId', e.target.value)}
 className="mt-1 w-full cursor-pointer rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 >
 <option value="">不关联</option>
 {resumes.map((r) => (
 <option key={r.id} value={r.id}>
 {r.versionName}
 {r.isDefault ? '（默认）' : ''}
 </option>
 ))}
 </select>
 {!draftJob && recommendedResumeId && recommendedResumeId === formValues.linkedResumeId ? (
 <p className="mt-1 text-xs text-emerald-700">已按岗位类型自动推荐简历版本。</p>
 ) : null}
 </div>
 {!quickMode ? (
 <>
 <div className="col-span-2">
 <Label className="text-[#666666]">标签（逗号分隔）</Label>
 <input
 type="text"
 value={formValues.tags}
 onChange={(e) => updateField('tags', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">备注</Label>
 <textarea
 rows={2}
 value={formValues.notes}
 onChange={(e) => updateField('notes', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">职位描述</Label>
 <textarea
 rows={3}
 value={formValues.description}
 onChange={(e) => updateField('description', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">任职要求（每行一条）</Label>
 <textarea
 rows={3}
 value={formValues.requirements}
 onChange={(e) => updateField('requirements', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 <div className="col-span-2">
 <Label className="text-[#666666]">福利待遇（每行一条）</Label>
 <textarea
 rows={3}
 value={formValues.benefits}
 onChange={(e) => updateField('benefits', e.target.value)}
 className="mt-1 w-full rounded-[20px] border-none bg-[#f4f2ee] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1a1a1a]/10"
 />
 </div>
 </>
 ) : null}
 </div>

 <div className="flex gap-3 pt-2">
 <button
 type="button"
 onClick={onClose}
 className="flex-1 rounded-full border border-[#ddd6cc] bg-white py-3 font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f4f2ee]"
 >
 取消
 </button>
 <button
 type="button"
 onClick={handleSave}
 className="flex-1 rounded-full bg-[#1a1a1a] py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
 >
 保存岗位
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}
