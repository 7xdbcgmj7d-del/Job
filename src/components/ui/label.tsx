'use client'

import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/components/ui/utils'

export function Label(props: React.ComponentProps<typeof LabelPrimitive.Root>) {
 return (
 <LabelPrimitive.Root
 data-slot="label"
 className={cn('text-sm font-medium leading-none', props.className)}
 {...props}
 />
 )
}
