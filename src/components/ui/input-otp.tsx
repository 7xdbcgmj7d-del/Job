'use client'

import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export const InputOTP = OTPInput
export const InputOTPGroup = (props: React.ComponentProps<'div'>) => <div className={cn('flex items-center gap-1', props.className)} {...props} />
export function InputOTPSlot({ index, className, ...props }: React.ComponentProps<'div'> & { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const { char } = ctx?.slots[index] ?? {}
  return <div className={cn('border-input flex size-9 items-center justify-center border', className)} {...props}>{char}</div>
}
export const InputOTPSeparator = (props: React.ComponentProps<'div'>) => <div role='separator' {...props}><MinusIcon /></div>
