import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

import type { InterviewDebrief } from '../../types'

interface InterviewDebriefFormProps {
 value: InterviewDebrief
 onChange: (next: InterviewDebrief) => void
 questionBank?: string[]
}

function updateStringArray(
 arr: string[],
 index: number,
 text: string,
 onUpdate: (next: string[]) => void
) {
 const next = [...arr]
 next[index] = text
 onUpdate(next)
}

function addStringRow(arr: string[], onUpdate: (next: string[]) => void) {
 onUpdate([...arr, ''])
}

function removeStringRow(
 arr: string[],
 index: number,
 onUpdate: (next: string[]) => void
) {
 if (arr.length <= 1) return
 onUpdate(arr.filter((_, i) => i !== index))
}

export function InterviewDebriefForm({ value, onChange, questionBank = [] }: InterviewDebriefFormProps) {
 const rating = Math.min(5, Math.max(1, value.selfRating))

 return (
 <div className="flex flex-col gap-5">
 <div>
 <Label className="mb-2 block text-[#1a1a1a]">面试问题</Label>
 <p className="mb-2 text-xs text-[#666666]">记录被问到的问题</p>
 {questionBank.length > 0 ? (
 <div className="mb-2 flex flex-wrap gap-1.5">
 {questionBank.slice(0, 8).map((question) => (
 <button
 key={question}
 type="button"
 className="rounded-full border border-[#ddd6cc] bg-white px-2.5 py-1 text-xs text-[#666666] hover:bg-[#f4f2ee]"
 onClick={() =>
 onChange({
 ...value,
 questions: value.questions.includes(question)
 ? value.questions
 : [...value.questions.filter(Boolean), question],
 })
 }
 >
 + {question}
 </button>
 ))}
 </div>
 ) : null}
 <div className="space-y-2">
 {value.questions.map((q, i) => (
 <div key={`q-${i}`} className="flex gap-2">
 <Input
 value={q}
 onChange={(e) =>
 updateStringArray(value.questions, i, e.target.value, (next) =>
 onChange({ ...value, questions: next })
 )
 }
 placeholder={`问题 ${i + 1}`}
 className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
 />
 <Button
 type="button"
 variant="outline"
 size="icon"
 className="shrink-0 rounded-xl"
 onClick={() => removeStringRow(value.questions, i, (next) => onChange({ ...value, questions: next }))}
 aria-label="删除该行"
 >
 <Minus className="size-4" />
 </Button>
 </div>
 ))}
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="text-[#1a1a1a]"
 onClick={() => addStringRow(value.questions, (next) => onChange({ ...value, questions: next }))}
 >
 <Plus className="size-4" />
 添加问题
 </Button>
 </div>
 </div>

 <div>
 <Label className="mb-2 block text-[#1a1a1a]">自我评分（1–5）</Label>
 <div className="flex items-center gap-4 pt-2">
 <Slider
 min={1}
 max={5}
 step={1}
 value={[rating]}
 onValueChange={(v) => onChange({ ...value, selfRating: v[0] ?? 3 })}
 className="max-w-[200px]"
 />
 <span className="text-sm font-semibold tabular-nums text-[#1a1a1a]">{rating} 分</span>
 </div>
 </div>

 <div>
 <Label className="mb-2 block text-[#1a1a1a]">表现亮点</Label>
 <p className="mb-2 text-xs text-[#666666]">本次表现好的地方</p>
 <div className="space-y-2">
 {value.highlights.map((line, i) => (
 <div key={`h-${i}`} className="flex gap-2">
 <Input
 value={line}
 onChange={(e) =>
 updateStringArray(value.highlights, i, e.target.value, (next) =>
 onChange({ ...value, highlights: next })
 )
 }
 placeholder="亮点"
 className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
 />
 <Button
 type="button"
 variant="outline"
 size="icon"
 className="shrink-0 rounded-xl"
 onClick={() =>
 removeStringRow(value.highlights, i, (next) => onChange({ ...value, highlights: next }))
 }
 aria-label="删除该行"
 >
 <Minus className="size-4" />
 </Button>
 </div>
 ))}
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => addStringRow(value.highlights, (next) => onChange({ ...value, highlights: next }))}
 >
 <Plus className="size-4" />
 添加亮点
 </Button>
 </div>
 </div>

 <div>
 <Label className="mb-2 block text-[#1a1a1a]">待改进</Label>
 <p className="mb-2 text-xs text-[#666666]">需要改进的地方</p>
 <div className="space-y-2">
 {value.improvements.map((line, i) => (
 <div key={`m-${i}`} className="flex gap-2">
 <Input
 value={line}
 onChange={(e) =>
 updateStringArray(value.improvements, i, e.target.value, (next) =>
 onChange({ ...value, improvements: next })
 )
 }
 placeholder="待改进点"
 className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
 />
 <Button
 type="button"
 variant="outline"
 size="icon"
 className="shrink-0 rounded-xl"
 onClick={() =>
 removeStringRow(value.improvements, i, (next) => onChange({ ...value, improvements: next }))
 }
 aria-label="删除该行"
 >
 <Minus className="size-4" />
 </Button>
 </div>
 ))}
 <Button
 type="button"
 variant="ghost"
 size="sm"
 onClick={() => addStringRow(value.improvements, (next) => onChange({ ...value, improvements: next }))}
 >
 <Plus className="size-4" />
 添加待改进项
 </Button>
 </div>
 </div>

 <div>
 <Label htmlFor="debrief-follow" className="mb-2 block text-[#1a1a1a]">
 后续行动
 </Label>
 <Textarea
 id="debrief-follow"
 value={value.followUp}
 onChange={(e) => onChange({ ...value, followUp: e.target.value })}
 placeholder="接下来需要做的事情"
 rows={3}
 className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
 />
 </div>

 <div>
 <Label htmlFor="debrief-notes" className="mb-2 block text-[#1a1a1a]">
 其他笔记
 </Label>
 <Textarea
 id="debrief-notes"
 value={value.otherNotes}
 onChange={(e) => onChange({ ...value, otherNotes: e.target.value })}
 placeholder="自由记录"
 rows={3}
 className="rounded-xl border-[#e8e6e2] bg-[#fbfaf8]"
 />
 </div>
 </div>
 )
}
