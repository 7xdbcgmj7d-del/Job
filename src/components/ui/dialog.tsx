'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
 return <DialogPrimitive.Root data-slot="dialog" {...props} />
}
export function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
 return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}
export function DialogContent({
 className,
 children,
 ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
 return (
 <DialogPrimitive.Portal>
 <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
 <DialogPrimitive.Content
 className={cn(
 'bg-background fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg',
 className,
 )}
 {...props}
 >
 {children}
 <DialogPrimitive.Close className="absolute right-4 top-4">
 <XIcon className="size-4" />
 </DialogPrimitive.Close>
 </DialogPrimitive.Content>
 </DialogPrimitive.Portal>
 )
}
export function DialogHeader(props: React.ComponentProps<'div'>) {
 return <div data-slot="dialog-header" className={cn('flex flex-col gap-2 text-center sm:text-left', props.className)} {...props} />
}
export function DialogFooter(props: React.ComponentProps<'div'>) {
 return <div data-slot="dialog-footer" className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.className)} {...props} />
}
export function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
 return <DialogPrimitive.Title data-slot="dialog-title" className={cn('text-lg font-semibold', props.className)} {...props} />
}
export function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
 return <DialogPrimitive.Description data-slot="dialog-description" className={cn('text-muted-foreground text-sm', props.className)} {...props} />
}
