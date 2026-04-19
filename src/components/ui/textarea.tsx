import { cn } from '@/components/ui/utils'

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input bg-input-background min-h-24 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
