import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/components/ui/utils'

export const Pagination = (props: React.ComponentProps<'nav'>) => <nav aria-label='pagination' className={cn('mx-auto flex w-full justify-center', props.className)} {...props} />
export const PaginationContent = (props: React.ComponentProps<'ul'>) => <ul className={cn('flex flex-row items-center gap-1', props.className)} {...props} />
export const PaginationItem = (props: React.ComponentProps<'li'>) => <li {...props} />
export const PaginationLink = ({ className, ...props }: React.ComponentProps<'a'>) => <a className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), className)} {...props} />
export const PaginationPrevious = (props: React.ComponentProps<typeof PaginationLink>) => <PaginationLink {...props}><ChevronLeftIcon /></PaginationLink>
export const PaginationNext = (props: React.ComponentProps<typeof PaginationLink>) => <PaginationLink {...props}><ChevronRightIcon /></PaginationLink>
export const PaginationEllipsis = (props: React.ComponentProps<'span'>) => <span {...props}><MoreHorizontalIcon className='size-4' /></span>
