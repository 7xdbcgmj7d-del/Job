'use client'

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

export const ContextMenu = ContextMenuPrimitive.Root
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger
export const ContextMenuContent = ContextMenuPrimitive.Content
export const ContextMenuItem = ContextMenuPrimitive.Item
export const ContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem
export const ContextMenuRadioItem = ContextMenuPrimitive.RadioItem
export const ContextMenuLabel = ContextMenuPrimitive.Label
export const ContextMenuSeparator = ContextMenuPrimitive.Separator
export const ContextMenuShortcut = (props: React.ComponentProps<'span'>) => <span {...props} />
export const ContextMenuGroup = ContextMenuPrimitive.Group
export const ContextMenuPortal = ContextMenuPrimitive.Portal
export const ContextMenuSub = ContextMenuPrimitive.Sub
export const ContextMenuSubContent = ContextMenuPrimitive.SubContent
export const ContextMenuSubTrigger = ContextMenuPrimitive.SubTrigger
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup
