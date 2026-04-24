'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close

export function SheetContent({
 className,
 children,
 side = 'right',
 ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
 side?: 'top' | 'right' | 'bottom' | 'left'
}) {
 return (
 <SheetPrimitive.Portal>
 <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
 <SheetPrimitive.Content
 className={cn(
 'bg-background fixed z-50 flex flex-col gap-4 border p-6 shadow-lg',
 side === 'right' && 'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm',
 side === 'left' && 'inset-y-0 left-0 h-full w-3/4 sm:max-w-sm',
 side === 'top' && 'inset-x-0 top-0 h-auto',
 side === 'bottom' && 'inset-x-0 bottom-0 h-auto',
 className,
 )}
 {...props}
 >
 {children}
 <SheetPrimitive.Close className="absolute right-4 top-4">
 <XIcon className="size-4" />
 </SheetPrimitive.Close>
 </SheetPrimitive.Content>
 </SheetPrimitive.Portal>
 )
}
export const SheetHeader = (props: React.ComponentProps<'div'>) => <div className={cn('flex flex-col gap-1.5', props.className)} {...props} />
export const SheetFooter = (props: React.ComponentProps<'div'>) => <div className={cn('mt-auto flex flex-col gap-2', props.className)} {...props} />
export const SheetTitle = (props: React.ComponentProps<typeof SheetPrimitive.Title>) => <SheetPrimitive.Title className={cn('font-semibold', props.className)} {...props} />
export const SheetDescription = (props: React.ComponentProps<typeof SheetPrimitive.Description>) => <SheetPrimitive.Description className={cn('text-muted-foreground text-sm', props.className)} {...props} />
