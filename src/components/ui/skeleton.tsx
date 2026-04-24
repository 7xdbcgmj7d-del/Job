import { cn } from '@/components/ui/utils'

export function Skeleton(props: React.ComponentProps<'div'>) {
 return <div className={cn('bg-accent animate-pulse rounded-md', props.className)} {...props} />
}
