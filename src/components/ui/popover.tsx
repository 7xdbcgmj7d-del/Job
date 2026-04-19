'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/components/ui/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor

export function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
