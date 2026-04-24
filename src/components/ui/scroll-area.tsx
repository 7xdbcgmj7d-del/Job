'use client'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/components/ui/utils'

export function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
 return (
 <ScrollAreaPrimitive.Root className={cn('relative', className)} {...props}>
 <ScrollAreaPrimitive.Viewport className='size-full rounded-[inherit]'>{children}</ScrollAreaPrimitive.Viewport>
 <ScrollBar />
 <ScrollAreaPrimitive.Corner />
 </ScrollAreaPrimitive.Root>
 )
}
export function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
 return <ScrollAreaPrimitive.ScrollAreaScrollbar orientation={orientation} className={cn('flex touch-none p-px', className)} {...props}><ScrollAreaPrimitive.ScrollAreaThumb className='bg-border relative flex-1 rounded-full' /></ScrollAreaPrimitive.ScrollAreaScrollbar>
}
