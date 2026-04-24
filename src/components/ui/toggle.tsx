'use client'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/ui/utils'

export const toggleVariants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium', {
 variants: {
 variant: { default: 'bg-transparent', outline: 'border border-input bg-transparent' },
 size: { default: 'h-9 px-2', sm: 'h-8 px-1.5', lg: 'h-10 px-2.5' },
 },
 defaultVariants: { variant: 'default', size: 'default' },
})

export function Toggle({ className, variant, size, ...props }: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
 return <TogglePrimitive.Root className={cn(toggleVariants({ variant, size }), className)} {...props} />
}
