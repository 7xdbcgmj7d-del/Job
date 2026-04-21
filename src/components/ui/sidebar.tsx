export * from '@/components/ui/sheet'
export const Sidebar = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarContent = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarFooter = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarGroup = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarGroupAction = (props: React.ComponentProps<'button'>) => <button {...props} />
export const SidebarGroupContent = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarGroupLabel = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarHeader = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarInput = (props: React.ComponentProps<'input'>) => <input {...props} />
export const SidebarInset = (props: React.ComponentProps<'main'>) => <main {...props} />
export const SidebarMenu = (props: React.ComponentProps<'ul'>) => <ul {...props} />
export const SidebarMenuAction = (props: React.ComponentProps<'button'>) => <button {...props} />
export const SidebarMenuBadge = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarMenuButton = (props: React.ComponentProps<'button'>) => <button {...props} />
export const SidebarMenuItem = (props: React.ComponentProps<'li'>) => <li {...props} />
export const SidebarMenuSkeleton = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarMenuSub = (props: React.ComponentProps<'ul'>) => <ul {...props} />
export const SidebarMenuSubButton = (props: React.ComponentProps<'a'>) => <a {...props} />
export const SidebarMenuSubItem = (props: React.ComponentProps<'li'>) => <li {...props} />
export const SidebarProvider = (props: React.ComponentProps<'div'>) => <div {...props} />
export const SidebarRail = (props: React.ComponentProps<'button'>) => <button {...props} />
export const SidebarSeparator = (props: React.ComponentProps<'hr'>) => <hr {...props} />
export const SidebarTrigger = (props: React.ComponentProps<'button'>) => <button {...props} />
export const useSidebar = () => ({ state: 'expanded' as const, open: true, setOpen: () => undefined, openMobile: false, setOpenMobile: () => undefined, isMobile: false, toggleSidebar: () => undefined })
