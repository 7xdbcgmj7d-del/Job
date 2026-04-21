import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/components/ui/utils'

export const Breadcrumb = (props: React.ComponentProps<'nav'>) => <nav aria-label='breadcrumb' {...props} />
export const BreadcrumbList = (props: React.ComponentProps<'ol'>) => <ol className={cn('text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm', props.className)} {...props} />
export const BreadcrumbItem = (props: React.ComponentProps<'li'>) => <li className={cn('inline-flex items-center gap-1.5', props.className)} {...props} />
export const BreadcrumbLink = (props: React.ComponentProps<'a'> & { asChild?: boolean }) => <a className={cn('hover:text-foreground transition-colors', props.className)} {...props} />
export const BreadcrumbPage = (props: React.ComponentProps<'span'>) => <span aria-current='page' className={cn('text-foreground', props.className)} {...props} />
export const BreadcrumbSeparator = ({ children, ...props }: React.ComponentProps<'li'>) => <li {...props}>{children ?? <ChevronRight />}</li>
export const BreadcrumbEllipsis = (props: React.ComponentProps<'span'>) => <span {...props}><MoreHorizontal className='size-4' /></span>
