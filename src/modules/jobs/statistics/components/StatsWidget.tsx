interface StatItemProps {
  label: string
  value: number
  color?: string
}

function StatItem({ label, value, color }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-2xl font-extrabold" style={{ color: color ?? '#1a1a1a' }}>
        {value}
      </div>
      <div className="text-xs text-[#666666]">{label}</div>
    </div>
  )
}

export function StatsWidget() {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-[20px] bg-white p-5">
      <StatItem label="总投递" value={24} />
      <StatItem label="面试中" value={8} />
      <StatItem label="Offer" value={3} color="#4CAF50" />
    </div>
  )
}
