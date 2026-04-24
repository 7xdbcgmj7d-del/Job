function pad2(value: number): string {
 return String(value).padStart(2, '0')
}

export function formatInterviewDateTime(value: string | Date): string {
 const date = value instanceof Date ? value : new Date(value)
 if (Number.isNaN(date.getTime())) return ''
 return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}
