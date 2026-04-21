'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/components/ui/utils'

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn('relative flex w-full touch-none items-center', className)} {...props}>
      <SliderPrimitive.Track className='bg-muted relative h-4 w-full grow overflow-hidden rounded-full'>
        <SliderPrimitive.Range className='bg-primary absolute h-full' />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className='border-primary bg-background block size-4 rounded-full border shadow-sm' />
    </SliderPrimitive.Root>
  )
}
