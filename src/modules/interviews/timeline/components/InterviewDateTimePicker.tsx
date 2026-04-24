import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { zhCN } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'

import { Label } from '@/components/ui/label'
import { formatInterviewDateTime } from '@/modules/interviews/utils/formatInterviewDateTime'

interface InterviewDateTimePickerProps {
 value: string
 onChange: (value: string) => void
}

const YEAR_START = 2010
const YEAR_END = 2035

function pad2(n: number): string {
 return String(n).padStart(2, '0')
}

function buildLocalDateTimeValue(date: Date, hour: number, minute: number): string {
 return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(hour)}:${pad2(minute)}`
}

function parseLocalDateTimeValue(value: string): { date?: Date; hour: number; minute: number } {
 if (!value) return { hour: 9, minute: 0 }
 const date = new Date(value)
 if (Number.isNaN(date.getTime())) return { hour: 9, minute: 0 }
 return {
 date,
 hour: date.getHours(),
 minute: date.getMinutes(),
 }
}

export function InterviewDateTimePicker({ value, onChange }: InterviewDateTimePickerProps) {
 const [open, setOpen] = useState(false)
 const [yearPanelOpen, setYearPanelOpen] = useState(false)
 const [monthPanelOpen, setMonthPanelOpen] = useState(false)
 const parsed = useMemo(() => parseLocalDateTimeValue(value), [value])
 const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
 if (parsed.date) return new Date(parsed.date.getFullYear(), parsed.date.getMonth(), 1)
 const now = new Date()
 return new Date(now.getFullYear(), now.getMonth(), 1)
 })
 const hourListRef = useRef<HTMLDivElement | null>(null)
 const minuteListRef = useRef<HTMLDivElement | null>(null)
 const rootRef = useRef<HTMLDivElement | null>(null)
 const selectedDate = parsed.date
 ? new Date(parsed.date.getFullYear(), parsed.date.getMonth(), parsed.date.getDate())
 : undefined
 const selectedHour = parsed.hour
 const selectedMinute = parsed.minute

 useEffect(() => {
 if (!parsed.date) return
 setVisibleMonth(new Date(parsed.date.getFullYear(), parsed.date.getMonth(), 1))
 }, [parsed.date?.getFullYear(), parsed.date?.getMonth()])

 useEffect(() => {
 if (!open) return
 const hourSelected = hourListRef.current?.querySelector('[data-selected="true"]')
 if (hourSelected instanceof HTMLElement) {
 hourSelected.scrollIntoView({ block: 'center' })
 }
 }, [open, selectedHour])

 useEffect(() => {
 if (!open) return
 const minuteSelected = minuteListRef.current?.querySelector('[data-selected="true"]')
 if (minuteSelected instanceof HTMLElement) {
 minuteSelected.scrollIntoView({ block: 'center' })
 }
 }, [open, selectedMinute])

 useEffect(() => {
 if (!open) {
 setYearPanelOpen(false)
 setMonthPanelOpen(false)
 }
 }, [open])

 useEffect(() => {
 if (!open) return
 const handlePointerDown = (event: MouseEvent) => {
 const target = event.target as Node
 if (!rootRef.current?.contains(target)) {
 setOpen(false)
 }
 }
 document.addEventListener('mousedown', handlePointerDown)
 return () => document.removeEventListener('mousedown', handlePointerDown)
 }, [open])
 const displayLabel = useMemo(() => {
 if (!value) return '请选择面试时间'
 return formatInterviewDateTime(value) || '请选择面试时间'
 }, [value])

 const applyChange = (date: Date, hour: number, minute: number) => {
 onChange(buildLocalDateTimeValue(date, hour, minute))
 }

 const handleDateChange = (date?: Date) => {
 if (!date) return
 applyChange(date, selectedHour, selectedMinute)
 }

 const setMonthByYear = (year: number) => {
 setVisibleMonth((prev) => new Date(year, prev.getMonth(), 1))
 }

 const setMonthByIndex = (month: number) => {
 setVisibleMonth((prev) => new Date(prev.getFullYear(), month, 1))
 }

 const changeVisibleMonth = (offset: number) => {
 setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
 }

 const handleHourChange = (nextHour: number) => {
 const baseDate = selectedDate ?? new Date()
 applyChange(baseDate, nextHour, selectedMinute)
 }

 const handleMinuteChange = (nextMinute: number) => {
 const baseDate = selectedDate ?? new Date()
 applyChange(baseDate, selectedHour, nextMinute)
 }

 const hourOptions = Array.from({ length: 24 }, (_, i) => i)
 const minuteOptions = Array.from({ length: 60 }, (_, i) => i)
 const monthOptions = Array.from({ length: 12 }, (_, i) => i)
 const yearOptions = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => YEAR_START + i)

 return (
 <div ref={rootRef} className="relative space-y-2">
 <button
 type="button"
 onClick={() => setOpen((prev) => !prev)}
 className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-xl border border-[#e8e6e2] bg-[#fbfaf8] px-4 py-2 text-left text-sm font-normal text-[#1a1a1a] transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
 >
 <span className="truncate">{displayLabel}</span>
 <CalendarIcon className="size-4 shrink-0" />
 </button>

 {open ? (
 <div className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-xl border border-[#e8e6e2] bg-white shadow-lg">
 <div className="grid max-h-[430px] grid-cols-[minmax(0,1fr)_190px] bg-white">
 <div className="relative border-r border-[#e8e6e2] p-3">
 <div className="mb-2 flex items-center justify-center gap-0.5">
 <button
 type="button"
 className="rounded-md p-0.5 text-[#4f77c4] hover:bg-[#f3f7ff]"
 onClick={() => changeVisibleMonth(-12)}
 aria-label="上一年"
 >
 <ChevronsLeft className="size-3.5" />
 </button>
 <button
 type="button"
 className="rounded-md p-0.5 text-[#4f77c4] hover:bg-[#f3f7ff]"
 onClick={() => changeVisibleMonth(-1)}
 aria-label="上一月"
 >
 <ChevronLeft className="size-3.5" />
 </button>
 <button
 type="button"
 className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-base leading-none font-semibold text-[#1a1a1a] hover:bg-[#f3f7ff]"
 onClick={() => {
 setYearPanelOpen((prev) => !prev)
 setMonthPanelOpen(false)
 }}
 >
 {visibleMonth.getFullYear()}年
 <ChevronDown className="size-3.5" />
 </button>
 <button
 type="button"
 className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-base leading-none font-semibold text-[#1a1a1a] hover:bg-[#f3f7ff]"
 onClick={() => {
 setMonthPanelOpen((prev) => !prev)
 setYearPanelOpen(false)
 }}
 >
 {visibleMonth.getMonth() + 1}月
 <ChevronDown className="size-3.5" />
 </button>
 <button
 type="button"
 className="rounded-md p-0.5 text-[#4f77c4] hover:bg-[#f3f7ff]"
 onClick={() => changeVisibleMonth(1)}
 aria-label="下一月"
 >
 <ChevronRight className="size-3.5" />
 </button>
 <button
 type="button"
 className="rounded-md p-0.5 text-[#4f77c4] hover:bg-[#f3f7ff]"
 onClick={() => changeVisibleMonth(12)}
 aria-label="下一年"
 >
 <ChevronsRight className="size-3.5" />
 </button>
 </div>
 <div className="relative">
 <DayPicker
 mode="single"
 month={visibleMonth}
 onMonthChange={setVisibleMonth}
 selected={selectedDate}
 onSelect={handleDateChange}
 locale={zhCN}
 showOutsideDays
 className="p-0"
 classNames={{
 months: 'flex',
 month: 'flex flex-col gap-2',
 caption: 'hidden',
 nav: 'hidden',
 table: 'w-full border-collapse',
 head_row: 'grid grid-cols-7',
 head_cell: 'text-center text-sm font-normal text-[#9a9a9a]',
 row: 'grid grid-cols-7 mt-1',
 cell: 'h-10 w-10 p-0 text-center',
 day: 'h-10 w-10 rounded-full text-lg font-medium text-[#1a1a1a] hover:bg-[#f3f7ff]',
 day_selected: 'bg-[#2f80ed] text-white hover:bg-[#2f80ed]',
 day_today: 'border border-[#d9e6ff]',
 day_outside: 'text-[#b9b9b9]',
 }}
 />
 {yearPanelOpen ? (
 <div className="absolute left-0 top-1 z-10 h-[220px] min-w-[112px] max-w-[128px] overflow-y-auto rounded-md border border-[#dfe5f0] bg-white shadow-lg">
 {yearOptions.map((year) => {
 const isActive = year === visibleMonth.getFullYear()
 return (
 <button
 key={year}
 type="button"
 onClick={() => {
 setMonthByYear(year)
 setYearPanelOpen(false)
 }}
 className={`block w-full whitespace-nowrap px-2 py-2 text-left text-base ${
 isActive ? 'bg-[#edf4ff] font-semibold text-[#1a1a1a]' : 'text-[#3a3a3a] hover:bg-[#f5f8ff]'
 }`}
 >
 {year}年
 </button>
 )
 })}
 </div>
 ) : null}
 {monthPanelOpen ? (
 <div className="absolute left-[120px] top-1 z-10 w-[185px] rounded-md border border-[#dfe5f0] bg-white p-2 shadow-lg">
 <div className="grid grid-cols-3 gap-1">
 {monthOptions.map((month) => {
 const isActive = month === visibleMonth.getMonth()
 return (
 <button
 key={month}
 type="button"
 onClick={() => {
 setMonthByIndex(month)
 setMonthPanelOpen(false)
 }}
 className={`rounded-md px-2 py-1.5 text-base ${
 isActive ? 'bg-[#edf4ff] font-semibold text-[#1a1a1a]' : 'text-[#3a3a3a] hover:bg-[#f5f8ff]'
 }`}
 >
 {month + 1}月
 </button>
 )
 })}
 </div>
 </div>
 ) : null}
 </div>
 </div>
 <div className="p-3">
 <div className="grid grid-cols-2 gap-2">
 <div className="space-y-1">
 <Label className="text-xs text-[#666666]">小时</Label>
 <div ref={hourListRef} className="h-[330px] overflow-y-auto rounded-md border border-[#e8e6e2] bg-white p-1">
 <div className="space-y-1">
 {hourOptions.map((hour) => {
 const isActive = hour === selectedHour
 return (
 <button
 key={hour}
 data-selected={isActive}
 type="button"
 onClick={() => handleHourChange(hour)}
 className={`w-full rounded-md px-2 py-1 text-center text-lg leading-6 transition ${
 isActive
 ? 'bg-[#2f80ed] font-semibold text-white'
 : 'text-[#1a1a1a] hover:bg-[#f3f7ff]'
 }`}
 >
 {pad2(hour)}
 </button>
 )
 })}
 </div>
 </div>
 </div>
 <div className="space-y-1">
 <Label className="text-xs text-[#666666]">分钟</Label>
 <div ref={minuteListRef} className="h-[330px] overflow-y-auto rounded-md border border-[#e8e6e2] bg-white p-1">
 <div className="space-y-1">
 {minuteOptions.map((minute) => {
 const isActive = minute === selectedMinute
 return (
 <button
 key={minute}
 data-selected={isActive}
 type="button"
 onClick={() => handleMinuteChange(minute)}
 className={`w-full rounded-md px-2 py-1 text-center text-lg leading-6 transition ${
 isActive
 ? 'bg-[#2f80ed] font-semibold text-white'
 : 'text-[#1a1a1a] hover:bg-[#f3f7ff]'
 }`}
 >
 {pad2(minute)}
 </button>
 )
 })}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 ) : null}
 </div>
 )
}
