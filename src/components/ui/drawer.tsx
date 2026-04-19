'use client'

import * as DrawerPrimitive from 'vaul'

export const Drawer = DrawerPrimitive.Drawer.Root
export const DrawerTrigger = DrawerPrimitive.Drawer.Trigger
export const DrawerPortal = DrawerPrimitive.Drawer.Portal
export const DrawerClose = DrawerPrimitive.Drawer.Close
export const DrawerOverlay = DrawerPrimitive.Drawer.Overlay
export const DrawerContent = DrawerPrimitive.Drawer.Content
export const DrawerHeader = (props: React.ComponentProps<'div'>) => <div {...props} />
export const DrawerFooter = (props: React.ComponentProps<'div'>) => <div {...props} />
export const DrawerTitle = DrawerPrimitive.Drawer.Title
export const DrawerDescription = DrawerPrimitive.Drawer.Description
