import { cn } from '@/components/ui/utils'

export const Card = (props: React.ComponentProps<'div'>) => (
  <div data-slot="card" className={cn('bg-card text-card-foreground rounded-xl border', props.className)} {...props} />
)
export const CardHeader = (props: React.ComponentProps<'div'>) => (
  <div data-slot="card-header" className={cn('px-6 pt-6', props.className)} {...props} />
)
export const CardTitle = (props: React.ComponentProps<'div'>) => (
  <h4 data-slot="card-title" className={cn('leading-none font-semibold', props.className)} {...props} />
)
export const CardDescription = (props: React.ComponentProps<'div'>) => (
  <p data-slot="card-description" className={cn('text-muted-foreground text-sm', props.className)} {...props} />
)
export const CardContent = (props: React.ComponentProps<'div'>) => (
  <div data-slot="card-content" className={cn('px-6 pb-6', props.className)} {...props} />
)
export const CardFooter = (props: React.ComponentProps<'div'>) => (
  <div data-slot="card-footer" className={cn('flex items-center px-6 pb-6', props.className)} {...props} />
)
export const CardAction = (props: React.ComponentProps<'div'>) => (
  <div data-slot="card-action" className={cn('', props.className)} {...props} />
)
