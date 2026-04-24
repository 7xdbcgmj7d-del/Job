import { Download, ExternalLink, FilePenLine, FileText, Plus, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/state/AppStateContext'

import { useResumeVersions } from '../hooks/useResumeVersions'
import type { ResumeSourceType, ResumeVersion } from '../types'

const MAX_FILE_BYTES = 900 * 1024

function splitList(input: string) {
 return input
 .split(/[,，\n]/)
 .map((s) => s.trim())
 .filter(Boolean)
}

function fileToDataUrl(file: File): Promise<string> {
 return new Promise((resolve, reject) => {
 const reader = new FileReader()
 reader.onload = () => resolve(String(reader.result))
 reader.onerror = () => reject(new Error('读取文件失败'))
 reader.readAsDataURL(file)
 })
}

export function ResumeManager() {
 const { jobs } = useAppState()
 const { resumes, addResume, updateResume, removeResume, setDefault } = useResumeVersions()
 const [dialogOpen, setDialogOpen] = useState(false)
 const [editingId, setEditingId] = useState<string | null>(null)
 const [versionName, setVersionName] = useState('')
 const [versionNote, setVersionNote] = useState('')
 const [type, setType] = useState<ResumeSourceType>('file')
 const [link, setLink] = useState('')
 const [fileName, setFileName] = useState('')
 const [fileMime, setFileMime] = useState('')
 const [fileData, setFileData] = useState('')
 const [targetRolesText, setTargetRolesText] = useState('')
 const [tagsText, setTagsText] = useState('')
 const [isDefault, setIsDefault] = useState(false)
 const [error, setError] = useState('')
 const defaultResumeId = useMemo(() => resumes.find((r) => r.isDefault)?.id, [resumes])

 const resetForm = () => {
 setEditingId(null)
 setVersionName('')
 setVersionNote('')
 setType('file')
 setLink('')
 setFileName('')
 setFileMime('')
 setFileData('')
 setTargetRolesText('')
 setTagsText('')
 setIsDefault(false)
 setError('')
 }

 const fillForm = (resume: ResumeVersion) => {
 setEditingId(resume.id)
 setVersionName(resume.versionName)
 setVersionNote(resume.versionNote)
 setType(resume.type)
 setLink(resume.link ?? '')
 setFileName(resume.fileName ?? '')
 setFileMime(resume.fileMime ?? '')
 setFileData(resume.fileData ?? '')
 setTargetRolesText(resume.targetRoles.join('，'))
 setTagsText(resume.tags.join('，'))
 setIsDefault(resume.isDefault)
 setError('')
 }

 const handleFile = async (file: File | undefined) => {
 if (!file) return
 if (file.size > MAX_FILE_BYTES) {
 setError(`文件过大，请小于 ${Math.round(MAX_FILE_BYTES / 1024)}KB，或改用外部链接。`)
 return
 }
 const ext = file.name.split('.').pop()?.toLowerCase()
 if (!ext || !['pdf', 'doc', 'docx'].includes(ext)) {
 setError('仅支持 PDF / Word（.doc / .docx）')
 return
 }
 setError('')
 setFileName(file.name)
 setFileMime(file.type || 'application/octet-stream')
 try {
 const data = await fileToDataUrl(file)
 setFileData(data)
 } catch {
 setError('读取文件失败')
 }
 }

 const handleSubmit = () => {
 if (!versionName.trim()) {
 setError('请填写版本名称')
 return
 }
 if (type === 'link') {
 if (!link.trim()) {
 setError('请填写简历链接')
 return
 }
 const trimmed = link.trim()
 try {
 const u = new URL(trimmed)
 if (u.protocol !== 'http:' && u.protocol !== 'https:') {
 setError('链接需以 http 或 https 开头')
 return
 }
 } catch {
 setError('链接格式不正确')
 return
 }
 const payload = {
 versionName: versionName.trim(),
 versionNote: versionNote.trim(),
 type: 'link',
 link: trimmed,
 targetRoles: splitList(targetRolesText),
 tags: splitList(tagsText),
 isDefault,
 } as const
 if (editingId) {
 updateResume(editingId, {
 ...payload,
 fileName: undefined,
 fileMime: undefined,
 fileData: undefined,
 })
 } else {
 addResume(payload)
 }
 } else {
 if (!fileData) {
 setError('请上传简历文件')
 return
 }
 const payload = {
 versionName: versionName.trim(),
 versionNote: versionNote.trim(),
 type: 'file',
 fileName,
 fileMime,
 fileData,
 targetRoles: splitList(targetRolesText),
 tags: splitList(tagsText),
 isDefault,
 } as const
 if (editingId) {
 updateResume(editingId, {
 ...payload,
 link: undefined,
 })
 } else {
 addResume(payload)
 }
 }
 setDialogOpen(false)
 resetForm()
 }

 const handleDownload = (r: ResumeVersion) => {
 if (r.type === 'link' && r.link) {
 window.open(r.link, '_blank', 'noopener,noreferrer')
 return
 }
 if (r.type === 'file' && r.fileData && r.fileName) {
 const a = document.createElement('a')
 a.href = r.fileData
 a.download = r.fileName
 a.click()
 }
 }

 const usageCountByResumeId = useMemo(() => {
 const m = new Map<string, number>()
 for (const job of jobs) {
 if (!job.linkedResumeId) continue
 m.set(job.linkedResumeId, (m.get(job.linkedResumeId) ?? 0) + 1)
 }
 return m
 }, [jobs])

 return (
 <div className="mx-auto max-w-3xl space-y-6">
 <div className="flex flex-wrap items-end justify-between gap-4">
 <div>
 <h1 className="text-3xl font-bold text-[#1a1a1a]">简历管理</h1>
 <p className="mt-1 text-sm text-[#666666]">多版本简历、默认版本与本地存储</p>
 </div>
 <Button
 type="button"
 className="rounded-full bg-[#1a1a1a] text-white hover:bg-[#333333]"
 onClick={() => {
 resetForm()
 setDialogOpen(true)
 }}
 >
 <Plus className="size-4" />
 新增版本
 </Button>
 </div>

 <ul className="space-y-4">
 {resumes.length === 0 ? (
 <li className="rounded-[24px] border border-dashed border-[#ddd6cc] bg-white p-5 text-center">
 <p className="text-sm text-[#666666]">还没有简历版本，先新增一份用于岗位自动关联。</p>
 <Button
 type="button"
 className="mt-3 rounded-full bg-[#1a1a1a] text-white hover:bg-[#333333]"
 onClick={() => {
 resetForm()
 setDialogOpen(true)
 }}
 >
 <Plus className="size-4" />
 立即新增简历
 </Button>
 </li>
 ) : null}
 {resumes.map((r) => (
 <li
 key={r.id}
 className="rounded-[24px] border border-[#e8e6e2] bg-white p-5 shadow-sm"
 >
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div className="flex min-w-0 flex-1 gap-3">
 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ee]">
 <FileText className="size-5 text-[#1a1a1a]" />
 </div>
 <div className="min-w-0">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="font-semibold text-[#1a1a1a]">{r.versionName}</h3>
 {r.isDefault ? (
 <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
 <Star className="size-3" />
 默认
 </span>
 ) : null}
 <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
 使用 {usageCountByResumeId.get(r.id) ?? 0} 次
 </span>
 <span className="rounded-full bg-[#f4f2ee] px-2 py-0.5 text-xs text-[#666666]">
 {r.type === 'file' ? '文件' : '链接'}
 </span>
 </div>
 {r.versionNote ? <p className="mt-1 text-sm text-[#666666]">{r.versionNote}</p> : null}
 <div className="mt-2 flex flex-wrap gap-1.5">
 {r.targetRoles.map((t) => (
 <span key={t} className="rounded-full bg-[#fbfaf8] px-2 py-0.5 text-xs text-[#444]">
 {t}
 </span>
 ))}
 {r.tags.map((t) => (
 <span key={t} className="rounded-full border border-dashed border-[#ddd6cc] px-2 py-0.5 text-xs text-[#666666]">
 #{t}
 </span>
 ))}
 </div>
 {r.type === 'link' && r.link ? (
 <p className="mt-2 truncate text-xs text-blue-700">{r.link}</p>
 ) : r.fileName ? (
 <p className="mt-2 text-xs text-[#666666]">{r.fileName}</p>
 ) : null}
 </div>
 </div>
 <div className="flex shrink-0 flex-wrap gap-2">
 {!r.isDefault ? (
 <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setDefault(r.id)}>
 设为默认
 </Button>
 ) : null}
 <Button
 type="button"
 variant="outline"
 size="sm"
 className="rounded-full"
 onClick={() => {
 fillForm(r)
 setDialogOpen(true)
 }}
 >
 <FilePenLine className="size-4" />
 编辑
 </Button>
 <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => handleDownload(r)}>
 {r.type === 'link' ? <ExternalLink className="size-4" /> : <Download className="size-4" />}
 {r.type === 'link' ? '打开' : '下载'}
 </Button>
 <Button
 type="button"
 variant="ghost"
 size="icon"
 className="rounded-full text-red-600 hover:bg-red-50"
 onClick={() => {
 if (window.confirm(`确定删除「${r.versionName}」？`)) removeResume(r.id)
 }}
 aria-label="删除"
 >
 <Trash2 className="size-4" />
 </Button>
 </div>
 </div>
 </li>
 ))}
 </ul>

 <Dialog
 open={dialogOpen}
 onOpenChange={(open) => {
 setDialogOpen(open)
 if (!open) resetForm()
 }}
 >
 <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-[24px] sm:max-w-lg">
 <DialogHeader>
 <DialogTitle>{editingId ? '编辑简历版本' : '新增简历版本'}</DialogTitle>
 <DialogDescription>命名、说明、文件或链接；可勾选设为默认简历（PRD 3.4.2 P1）。</DialogDescription>
 </DialogHeader>
 <div className="grid gap-3 py-2">
 <div>
 <Label htmlFor="rv-name">版本名称</Label>
 <Input
 id="rv-name"
 value={versionName}
 onChange={(e) => setVersionName(e.target.value)}
 placeholder="如 产品经理-B端版"
 className="mt-1 rounded-xl"
 />
 </div>
 <div>
 <Label htmlFor="rv-note">版本说明</Label>
 <Textarea
 id="rv-note"
 value={versionNote}
 onChange={(e) => setVersionNote(e.target.value)}
 placeholder="可选"
 rows={2}
 className="mt-1 rounded-xl"
 />
 </div>
 <div>
 <Label>类型</Label>
 <select
 value={type}
 onChange={(e) => setType(e.target.value as ResumeSourceType)}
 className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
 >
 <option value="file">文件上传</option>
 <option value="link">外部链接</option>
 </select>
 </div>
 {type === 'file' ? (
 <div>
 <Label htmlFor="rv-file">PDF / Word</Label>
 <Input
 id="rv-file"
 type="file"
 accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
 className="mt-1 cursor-pointer rounded-xl"
 onChange={(e) => void handleFile(e.target.files?.[0])}
 />
 {fileName ? <p className="mt-1 text-xs text-[#666666]">已选：{fileName}</p> : null}
 </div>
 ) : (
 <div>
 <Label htmlFor="rv-link">在线简历 URL</Label>
 <Input
 id="rv-link"
 value={link}
 onChange={(e) => setLink(e.target.value)}
 placeholder="https://"
 className="mt-1 rounded-xl"
 />
 </div>
 )}
 <div>
 <Label htmlFor="rv-roles">适用职位（逗号或换行分隔）</Label>
 <Textarea
 id="rv-roles"
 value={targetRolesText}
 onChange={(e) => setTargetRolesText(e.target.value)}
 rows={2}
 className="mt-1 rounded-xl"
 />
 </div>
 <div>
 <Label htmlFor="rv-tags">标签（逗号或换行分隔）</Label>
 <Textarea
 id="rv-tags"
 value={tagsText}
 onChange={(e) => setTagsText(e.target.value)}
 rows={2}
 className="mt-1 rounded-xl"
 />
 </div>
 <label className="flex cursor-pointer items-center gap-2 text-sm">
 <Checkbox checked={isDefault} onCheckedChange={(v) => setIsDefault(v === true)} />
 设为默认简历
 </label>
 <p className="text-xs text-[#666666]">
 默认联动规则：新增岗位会默认选中当前默认简历；删除已关联简历时，岗位会自动回退到默认简历。
 {defaultResumeId ? '' : '（当前无默认简历）'}
 </p>
 {error ? <p className="text-sm text-red-600">{error}</p> : null}
 </div>
 <DialogFooter>
 <Button type="button" variant="outline" className="rounded-full" onClick={() => setDialogOpen(false)}>
 取消
 </Button>
 <Button type="button" className="rounded-full bg-[#1a1a1a]" onClick={handleSubmit}>
 {editingId ? '保存修改' : '保存'}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 )
}
