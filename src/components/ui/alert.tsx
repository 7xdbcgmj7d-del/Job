import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/ui/utils'

const alertVariants = cva('relative w-full rounded-lg border px-4 py-3 text-sm', {
 variants: {
 variant: {
 default: 'bg-card text-card-foreground',
 destructive: 'bg-card text-destructive',
 },
 },
 defaultVariants: { variant: 'default' },
})

export function Alert({
 className,
 variant,
 ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
 return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}
export const AlertTitle = (props: React.ComponentProps<'div'>) => <div className={cn('font-medium tracking-tight', props.className)} {...props} />
export const AlertDescription = (props: React.ComponentProps<'div'>) => <div className={cn('text-muted-foreground text-sm', props.className)} {...props} />
