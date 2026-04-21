import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EmailLoginDialogProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onSendCode: (email: string) => Promise<void>
  onVerifyCode: (code: string) => Promise<void>
}

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
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-[#1f1f1f]">
        <h3 className="text-base font-semibold text-[#1a1a1a] dark:text-[#f5f5f5]">邮箱登录</h3>
        {step === 'email' ? (
          <div className="mt-4 space-y-3">
            <Input
              type="email"
              value={email}
              placeholder="请输入邮箱"
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl"
            />
            <Button
              type="button"
              className="w-full rounded-full bg-[#1a1a1a]"
              disabled={loading}
              onClick={() => void submitEmail()}
            >
              发送验证码
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                disabled={loading}
                onClick={() => {
                  setStep('email')
                  setCode('')
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
          className="mt-4 text-xs text-[#666666] underline dark:text-[#b8b8b8]"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  )
}
