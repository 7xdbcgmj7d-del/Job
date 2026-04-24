'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/components/ui/utils'

export function Switch(props: React.ComponentProps<typeof SwitchPrimitive.Root>) {
 return (
 <SwitchPrimitive.Root className={cn('data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background inline-flex h-[1.15rem] w-8 rounded-full', props.className)} {...props}>
 <SwitchPrimitive.Thumb className='bg-card block size-4 rounded-full transition-transform data-[state=checked]:translate-x-[calc(100%-2px)]' />
 </SwitchPrimitive.Root>
 )
}
