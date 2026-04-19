const chartData = [
  { day: '周一', value: 3, color: '#fadcd9' },
  { day: '周二', value: 5, color: '#dcd6f7' },
  { day: '周三', value: 2, color: '#c8e8d5' },
  { day: '周四', value: 6, color: '#fbe0c3' },
  { day: '周五', value: 4, color: '#c5e1a5' },
  { day: '周六', value: 1, color: '#fadcd9' },
  { day: '周日', value: 3, color: '#dcd6f7' },
]

export function ChartWidget() {
  const maxValue = Math.max(...chartData.map((d) => d.value))

  return (
    <div className="rounded-[20px] bg-white p-5">
      <h4 className="mb-4 text-sm font-semibold text-[#1a1a1a]">本周活动</h4>
      <div className="flex h-32 items-end justify-between gap-2">
        {chartData.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-[100px] w-full items-end justify-center">
              <div
                className="w-full rounded-t-[10px] transition-all"
                style={{
                  backgroundColor: item.color,
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '20px',
                }}
              />
            </div>
            <span className="text-xs text-[#666666]">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
