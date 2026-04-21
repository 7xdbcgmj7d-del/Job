'use client'

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { type VariantProps } from 'class-variance-authority'

import { toggleVariants } from '@/components/ui/toggle'

export const ToggleGroup = (props: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) => <ToggleGroupPrimitive.Root {...props} />
export const ToggleGroupItem = (props: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants>) => <ToggleGroupPrimitive.Item {...props} />
