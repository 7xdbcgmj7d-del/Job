import { useEffect, useState } from 'react'

import { useAuth } from '@/state/AuthContext'

export function OAuthCallbackPage() {
 const { completeOAuthCallback } = useAuth()
 const [message, setMessage] = useState('正在处理登录回调...')
 const [error, setError] = useState('')

 useEffect(() => {
 const params = new URLSearchParams(window.location.search)
 const code = params.get('code')
 const state = params.get('state')
 if (!code || !state) {
 setError('授权信息不完整。当前仅支持邮箱登录，请返回首页使用邮箱登录。')
 return
 }

 void completeOAuthCallback(code, state)
 .then(() => {
 setMessage('登录成功，正在返回应用...')
 })
 .catch((e: unknown) => {
 setError(e instanceof Error ? e.message : '登录回调处理失败，请返回首页使用邮箱登录。')
 })
 }, [completeOAuthCallback])

 return (
 <div className="flex min-h-screen items-center justify-center bg-[#fbfaf8] p-6 text-[#1a1a1a]">
 <div className="w-full max-w-md rounded-[24px] bg-white p-6 text-center">
 <h1 className="text-xl font-semibold">OAuth 登录</h1>
 {error ? (
 <>
 <p className="mt-3 text-sm text-red-600">{error}</p>
 <div className="mt-5 flex justify-center gap-2">
 <button
 type="button"
 className="rounded-full border border-[#d8d8d8] px-5 py-2 text-sm"
 onClick={() => window.location.replace('/')}
 >
 返回首页
 </button>
 </div>
 </>
 ) : (
 <p className="mt-3 text-sm text-[#666666]">{message}</p>
 )}
 </div>
 </div>
 )
}
