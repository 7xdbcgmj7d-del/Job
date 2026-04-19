import { Briefcase, Calendar, Home, Settings, Target } from 'lucide-react'
import type { ReactNode } from 'react'

interface NavItemProps {
  icon: ReactNode
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all ${
        active
          ? 'bg-[#1a1a1a] text-white shadow-md'
          : 'bg-transparent text-[#1a1a1a] hover:bg-white'
      }`}
    >
      {icon}
    </button>
  )
}

export function JobsSidebar() {
  return (
    <div className="flex h-screen w-[80px] flex-col items-center gap-8 bg-[#fbfaf8] py-6">
      <div className="h-10 w-10 rounded-xl bg-[#1a1a1a]" />
      <nav className="flex flex-1 flex-col gap-4">
        <NavItem icon={<Home size={24} />} />
        <NavItem icon={<Briefcase size={24} />} active />
        <NavItem icon={<Target size={24} />} />
        <NavItem icon={<Calendar size={24} />} />
        <NavItem icon={<Settings size={24} />} />
      </nav>
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
    </div>
  )
}
