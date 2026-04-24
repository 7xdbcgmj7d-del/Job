import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EmailLoginDialogProps {
 open: boolean
 loading?: boolean
 onClose: () => void
 onSendCode: (email: string) => Promise<void>
 onVerifyCode: (code: string) => Promise<void>
}

const CODE_RESEND_SECONDS = 60

export function EmailLoginDialog({
 open,
 loading = false,
 onClose,
 onSendCode,
 onVerifyCode,
}: EmailLoginDialogProps) {
 const [email, setEmail] = useState('')
 const [code, setCode] = useState('')
 const [step, setStep] = useState<'email' | 'code'>('email')
 const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!open) {
      setStep('email')
      setCode('')
      setError('')
      setCountdown(0)
    }
  }, [open])

  useEffect(() => {
    if (countdown <= 0) return

    const timer = window.setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [countdown])

 if (!open) return null

 const submitEmail = async () => {
 if (!email.trim()) {
 setError('请输入邮箱地址。')
 return
 }
 setError('')
 try {
 await onSendCode(email.trim())
 setStep('code')
   setCountdown(CODE_RESEND_SECONDS)
 } catch (e) {
 setError(e instanceof Error ? e.message : '发送验证码失败，请稍后重试。')
 }
 }

 const submitCode = async () => {
 if (!code.trim()) {
 setError('请输入验证码。')
 return
 }
 setError('')
 try {
 await onVerifyCode(code.trim())
 } catch (e) {
 setError(e instanceof Error ? e.message : '验证码校验失败，请重试。')
 }
 }

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
 <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
 <h3 className="text-base font-semibold text-[#1a1a1a]">邮箱登录</h3>
 {step === 'email' ? (
 <div className="mt-4 space-y-3">
    <Input
     type="email"
     value={email}
     placeholder="请使用qq邮箱登录"
     onChange={(e) => setEmail(e.target.value)}
     className="rounded-xl"
    />
 <Button
 type="button"
 className="w-full rounded-full bg-[#1a1a1a]"
     disabled={loading || countdown > 0}
 onClick={() => void submitEmail()}
 >
     {countdown > 0 ? `请稍候 ${countdown}s` : '发送验证码'}
 </Button>
 </div>
 ) : (
 <div className="mt-4 space-y-3">
 <Input
 value={code}
 placeholder="输入验证码"
 onChange={(e) => setCode(e.target.value)}
 className="rounded-xl"
 />
    <p className="text-xs text-[#666666]">
     {countdown > 0 ? `验证码已发送，${countdown}s 后可重新发送。` : '如未收到验证码，可返回重新发送。'}
    </p>
    {countdown === 0 ? (
     <Button
      type="button"
      variant="outline"
      className="w-full rounded-full"
      disabled={loading}
      onClick={() => void submitEmail()}
     >
      重新发送验证码
     </Button>
    ) : null}
 <div className="flex gap-2">
 <Button
 type="button"
 variant="outline"
 className="flex-1 rounded-full"
 disabled={loading}
 onClick={() => {
 setStep('email')
 setCode('')
       setCountdown(0)
 }}
 >
 返回
 </Button>
 <Button
 type="button"
 className="flex-1 rounded-full bg-[#1a1a1a]"
 disabled={loading}
 onClick={() => void submitCode()}
 >
 验证并登录
 </Button>
 </div>
 </div>
 )}
 {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
 <button
 type="button"
 className="mt-4 text-xs text-[#666666] underline"
    onClick={() => {
     setCountdown(0)
     onClose()
    }}
 >
 关闭
 </button>
 </div>
 </div>
 )
}
