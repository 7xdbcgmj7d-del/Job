'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/components/ui/utils'

export function TooltipProvider(props: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={0} {...props} />
}
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export function TooltipContent({
  className,
  sideOffset = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn('bg-primary text-primary-foreground z-50 rounded-md px-3 py-1.5 text-xs', className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}
