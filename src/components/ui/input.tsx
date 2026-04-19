import { cn } from '@/components/ui/utils'

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input bg-input-background flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-sm outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
