'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export function Checkbox(props: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
 return (
 <CheckboxPrimitive.Root className={cn('size-4 shrink-0 rounded-[4px] border', props.className)} {...props}>
 <CheckboxPrimitive.Indicator className='flex items-center justify-center'>
 <CheckIcon className='size-3.5' />
 </CheckboxPrimitive.Indicator>
 </CheckboxPrimitive.Root>
 )
}
