'use client'

import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '@/components/ui/utils'

export const Command = (props: React.ComponentProps<typeof CommandPrimitive>) => <CommandPrimitive className={cn('bg-popover text-popover-foreground', props.className)} {...props} />
export const CommandDialog = (props: React.ComponentProps<'div'>) => <div {...props} />
export const CommandInput = CommandPrimitive.Input
export const CommandList = CommandPrimitive.List
export const CommandEmpty = CommandPrimitive.Empty
export const CommandGroup = CommandPrimitive.Group
export const CommandItem = CommandPrimitive.Item
export const CommandShortcut = (props: React.ComponentProps<'span'>) => <span className={cn('ml-auto text-xs', props.className)} {...props} />
export const CommandSeparator = CommandPrimitive.Separator
