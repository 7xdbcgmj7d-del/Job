'use client'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/components/ui/utils'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export function AlertDialogOverlay(props: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return <AlertDialogPrimitive.Overlay className={cn('fixed inset-0 z-50 bg-black/50', props.className)} {...props} />
}
export function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn('bg-background fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg', className)}
        {...props}
      />
    </AlertDialogPortal>
  )
}
export const AlertDialogHeader = (props: React.ComponentProps<'div'>) => <div className={cn('flex flex-col gap-2', props.className)} {...props} />
export const AlertDialogFooter = (props: React.ComponentProps<'div'>) => <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.className)} {...props} />
export const AlertDialogTitle = (props: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', props.className)} {...props} />
export const AlertDialogDescription = (props: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => <AlertDialogPrimitive.Description className={cn('text-muted-foreground text-sm', props.className)} {...props} />
export const AlertDialogAction = (props: React.ComponentProps<typeof AlertDialogPrimitive.Action>) => <AlertDialogPrimitive.Action className={cn(buttonVariants(), props.className)} {...props} />
export const AlertDialogCancel = (props: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) => <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), props.className)} {...props} />
