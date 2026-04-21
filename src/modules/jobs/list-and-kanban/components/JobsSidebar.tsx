import { Briefcase, FileText, Home, Settings, Target } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { EmailLoginDialog } from '@/modules/auth'
import { useAuth } from '@/state'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type JobsAppSection = 'dashboard' | 'jobs' | 'resumes' | 'interviews' | 'settings'

interface NavItemProps {
  label: string
  icon: ReactNode
  active?: boolean
  onClick: () => void
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          title={label}
          onClick={onClick}
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-full transition-all ${
            active
              ? 'bg-[#1a1a1a] text-white shadow-md'
              : 'bg-transparent text-[#1a1a1a] hover:bg-white dark:text-[#f5f5f5] dark:hover:bg-[#2a2a2a]'
          }`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

interface JobsSidebarProps {
  activeSection?: JobsAppSection
  onSectionChange?: (section: JobsAppSection) => void
}

export function JobsSidebar({ activeSection = 'jobs', onSectionChange }: JobsSidebarProps) {
  const { user, isAuthenticated, isLoading, startEmailLogin, verifyEmailCode, logout } = useAuth()
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [challengeId, setChallengeId] = useState('')

  const go = (section: JobsAppSection) => onSectionChange?.(section)
  const bottomLabel = isAuthenticated ? '已登录' : '登录'

  return (
    <TooltipProvider>
      <div className="flex h-screen w-[80px] flex-col items-center gap-8 bg-[#fbfaf8] py-6 dark:bg-[#151515]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a1a1a] dark:bg-[#f5f5f5]">
          <svg
            viewBox="0 0 24 24"
            aria-label="Smile logo"
            role="img"
            className="h-6 w-6"
          >
            <circle cx="12" cy="12" r="9" className="fill-[#f7d046] dark:fill-[#f7d046]" />
            <circle cx="9" cy="10" r="1.1" className="fill-[#1a1a1a]" />
            <circle cx="15" cy="10" r="1.1" className="fill-[#1a1a1a]" />
            <path
              d="M8.2 13.2c1.1 1.6 2.4 2.3 3.8 2.3s2.7-.8 3.8-2.3"
              className="stroke-[#1a1a1a]"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <nav className="flex flex-1 flex-col gap-4">
          <NavItem
            label="首页看板"
            icon={<Home size={24} />}
            active={activeSection === 'dashboard'}
            onClick={() => go('dashboard')}
          />
          <NavItem
            label="岗位管理"
            icon={<Briefcase size={24} />}
            active={activeSection === 'jobs'}
            onClick={() => go('jobs')}
          />
          <NavItem
            label="简历管理"
            icon={<FileText size={24} />}
            active={activeSection === 'resumes'}
            onClick={() => go('resumes')}
          />
          <NavItem
            label="面试管理"
            icon={<Target size={24} />}
            active={activeSection === 'interviews'}
            onClick={() => go('interviews')}
          />
          <NavItem
            label="设置"
            icon={<Settings size={24} />}
            active={activeSection === 'settings'}
            onClick={() => go('settings')}
          />
        </nav>
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={isAuthenticated ? '账号已登录' : '点击登录账号'}
                onClick={() => {
                  if (isAuthenticated) {
                    setAccountMenuOpen((v) => !v)
                    return
                  }
                  setEmailDialogOpen(true)
                  setAccountMenuOpen(false)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-semibold text-white"
                title={isAuthenticated ? '账号已登录' : '点击登录账号'}
              >
                {bottomLabel}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {isAuthenticated ? '账号已登录' : '点击登录账号'}
            </TooltipContent>
          </Tooltip>
          {isAuthenticated && accountMenuOpen ? (
            <div className="absolute bottom-12 left-1/2 z-20 w-44 -translate-x-1/2 rounded-2xl border border-[#ece8df] bg-white p-2 shadow-md dark:border-[#3a3a3a] dark:bg-[#1f1f1f]">
              <div className="px-3 py-2 text-xs text-[#666666] dark:text-[#b8b8b8]">
                {user?.name ?? '已登录'}
              </div>
              <button
                type="button"
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1a1a1a] transition hover:bg-[#f4f2ee] dark:text-[#f5f5f5] dark:hover:bg-[#2a2a2a]"
                onClick={() => {
                  logout()
                  setAccountMenuOpen(false)
                }}
              >
                退出登录
              </button>
            </div>
          ) : null}
        </div>
        <EmailLoginDialog
          open={emailDialogOpen}
          loading={isLoading}
          onClose={() => setEmailDialogOpen(false)}
          onSendCode={async (email) => {
            const nextChallengeId = await startEmailLogin(email)
            setChallengeId(nextChallengeId)
          }}
          onVerifyCode={async (code) => {
            await verifyEmailCode(challengeId, code)
            setEmailDialogOpen(false)
            setChallengeId('')
          }}
        />
      </div>
    </TooltipProvider>
  )
}
