'use client'

import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/components/ui/utils'

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        nav_button: cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
        ...classNames,
      }}
      {...props}
    />
  )
}
