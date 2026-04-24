import { useState } from 'react'

import { useAuth } from '@/state'

export function UserInfo() {
 const { user, isAuthenticated, logout } = useAuth()
 const [menuOpen, setMenuOpen] = useState(false)
 const displayName = user?.name ?? '点击左下角登录'
 const status = user?.status ?? '未登录'
 const title = user?.title ?? '访客'

 return (
 <div className="mb-6 flex flex-col items-center gap-3">
 <div className="relative">
 <button
 type="button"
 aria-label={isAuthenticated ? '打开用户菜单' : '账号信息'}
 onClick={() => {
 if (!isAuthenticated) return
 setMenuOpen((v) => !v)
 }}
 className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-400"
 >
 {user?.avatarUrl ? (
 <img src={user.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
 ) : null}
 </button>
 <div className="absolute -right-1 -top-1 text-xl">👑</div>
 {isAuthenticated && menuOpen ? (
 <div className="absolute right-0 top-[74px] z-10 w-48 rounded-2xl border border-[#ece8df] bg-white p-2 shadow-md">
 <div className="px-3 py-2 text-xs text-[#666666]">{displayName}</div>
 <button
 type="button"
 className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1a1a1a] transition hover:bg-[#f4f2ee]"
 onClick={() => {
 logout()
 setMenuOpen(false)
 }}
 >
 退出登录
 </button>
 </div>
 ) : null}
 </div>
 <div className="text-center">
 <h3 className="font-semibold text-[#1a1a1a]">{displayName}</h3>
 <div className="mt-1.5 flex gap-2">
 <span className="rounded-full bg-white px-3 py-1 text-xs text-[#666666]">
 {status}
 </span>
 <span className="rounded-full bg-white px-3 py-1 text-xs text-[#666666]">
 {title}
 </span>
 </div>
 </div>
 </div>
 )
}
