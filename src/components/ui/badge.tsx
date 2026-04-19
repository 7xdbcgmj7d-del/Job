import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/ui/utils'

export const badgeVariants = cva('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground border-transparent',
      secondary: 'bg-secondary text-secondary-foreground border-transparent',
      destructive: 'bg-destructive text-white border-transparent',
      outline: 'text-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
})

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'
  return <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
}
