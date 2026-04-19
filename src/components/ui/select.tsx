'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cn('border-input bg-input-background flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm', className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild><ChevronDownIcon className='size-4 opacity-50' /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}
export function SelectContent({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn('bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-md', className)} {...props}>
        <SelectPrimitive.ScrollUpButton className='flex items-center justify-center py-1'><ChevronUpIcon className='size-4' /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className='p-1'>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className='flex items-center justify-center py-1'><ChevronDownIcon className='size-4' /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}
export const SelectLabel = (props: React.ComponentProps<typeof SelectPrimitive.Label>) => <SelectPrimitive.Label className={cn('text-muted-foreground px-2 py-1.5 text-xs', props.className)} {...props} />
export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn('relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-2 pr-8 text-sm', className)} {...props}>
      <span className='absolute right-2 flex size-3.5 items-center justify-center'><SelectPrimitive.ItemIndicator><CheckIcon className='size-4' /></SelectPrimitive.ItemIndicator></span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}
export const SelectSeparator = (props: React.ComponentProps<typeof SelectPrimitive.Separator>) => <SelectPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', props.className)} {...props} />
