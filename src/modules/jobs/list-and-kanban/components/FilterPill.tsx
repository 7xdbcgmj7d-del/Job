interface FilterPillProps {
  label: string
  active?: boolean
  onClick?: () => void
  count?: number
}

export function FilterPill({ label, active, onClick, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-5 py-2.5 transition-all ${
        active
          ? 'bg-[#1a1a1a] text-white'
          : 'bg-[#f4f2ee] text-[#1a1a1a] hover:bg-[#e8e6e2]'
      }`}
      style={{ fontWeight: active ? 700 : 400, fontSize: '14px' }}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  )
}
