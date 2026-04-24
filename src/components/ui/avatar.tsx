'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/components/ui/utils'

export function Avatar(props: React.ComponentProps<typeof AvatarPrimitive.Root>) {
 return <AvatarPrimitive.Root className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', props.className)} {...props} />
}
export function AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>) {
 return <AvatarPrimitive.Image className={cn('aspect-square size-full', props.className)} {...props} />
}
export function AvatarFallback(props: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
 return <AvatarPrimitive.Fallback className={cn('bg-muted flex size-full items-center justify-center rounded-full', props.className)} {...props} />
}
