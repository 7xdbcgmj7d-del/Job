'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/components/ui/utils'

export const Tabs = (props: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root className={cn('flex flex-col gap-2', props.className)} {...props} />
)
export const TabsList = (props: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List className={cn('bg-muted inline-flex h-9 items-center justify-center rounded-xl p-[3px]', props.className)} {...props} />
)
export const TabsTrigger = (props: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger className={cn('data-[state=active]:bg-card rounded-xl px-2 py-1 text-sm', props.className)} {...props} />
)
export const TabsContent = (props: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn('flex-1 outline-none', props.className)} {...props} />
)
