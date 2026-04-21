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
          : 'bg-[#f4f2ee] text-[#1a1a1a] hover:bg-[#e8e6e2] dark:bg-[#2a2a2a] dark:text-[#f5f5f5] dark:hover:bg-[#333333]'
      }`}
      style={{ fontWeight: active ? 700 : 400, fontSize: '14px' }}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  )
}
