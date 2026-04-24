'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem(props: React.ComponentProps<typeof AccordionPrimitive.Item>) {
 return <AccordionPrimitive.Item className={cn('border-b last:border-b-0', props.className)} {...props} />
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
 return (
 <AccordionPrimitive.Header className='flex'>
 <AccordionPrimitive.Trigger className={cn('flex flex-1 items-start justify-between gap-4 py-4 text-left text-sm font-medium', className)} {...props}>
 {children}
 <ChevronDownIcon className='size-4 shrink-0 transition-transform data-[state=open]:rotate-180' />
 </AccordionPrimitive.Trigger>
 </AccordionPrimitive.Header>
 )
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
 return (
 <AccordionPrimitive.Content className='overflow-hidden text-sm' {...props}>
 <div className={cn('pb-4 pt-0', className)}>{children}</div>
 </AccordionPrimitive.Content>
 )
}
