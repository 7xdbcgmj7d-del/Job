'use client'

import * as MenubarPrimitive from '@radix-ui/react-menubar'

export const Menubar = MenubarPrimitive.Root
export const MenubarPortal = MenubarPrimitive.Portal
export const MenubarMenu = MenubarPrimitive.Menu
export const MenubarTrigger = MenubarPrimitive.Trigger
export const MenubarContent = MenubarPrimitive.Content
export const MenubarGroup = MenubarPrimitive.Group
export const MenubarSeparator = MenubarPrimitive.Separator
export const MenubarLabel = MenubarPrimitive.Label
export const MenubarItem = MenubarPrimitive.Item
export const MenubarShortcut = (props: React.ComponentProps<'span'>) => <span {...props} />
export const MenubarCheckboxItem = MenubarPrimitive.CheckboxItem
export const MenubarRadioGroup = MenubarPrimitive.RadioGroup
export const MenubarRadioItem = MenubarPrimitive.RadioItem
export const MenubarSub = MenubarPrimitive.Sub
export const MenubarSubTrigger = MenubarPrimitive.SubTrigger
export const MenubarSubContent = MenubarPrimitive.SubContent
