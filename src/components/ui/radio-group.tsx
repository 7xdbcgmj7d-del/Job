'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export function RadioGroup(props: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('grid gap-3', props.className)} {...props} />
}
export function RadioGroupItem(props: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item className={cn('aspect-square size-4 rounded-full border', props.className)} {...props}>
      <RadioGroupPrimitive.Indicator className='relative flex items-center justify-center'>
        <CircleIcon className='size-2 fill-current' />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
