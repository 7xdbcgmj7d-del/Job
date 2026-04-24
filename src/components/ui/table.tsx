import { cn } from '@/components/ui/utils'

export const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
 <div className="relative w-full overflow-x-auto">
 <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
 </div>
)
export const TableHeader = (props: React.ComponentProps<'thead'>) => <thead className={cn('[&_tr]:border-b', props.className)} {...props} />
export const TableBody = (props: React.ComponentProps<'tbody'>) => <tbody className={cn('[&_tr:last-child]:border-0', props.className)} {...props} />
export const TableFooter = (props: React.ComponentProps<'tfoot'>) => <tfoot className={cn('bg-muted/50 border-t font-medium', props.className)} {...props} />
export const TableRow = (props: React.ComponentProps<'tr'>) => <tr className={cn('hover:bg-muted/50 border-b transition-colors', props.className)} {...props} />
export const TableHead = (props: React.ComponentProps<'th'>) => <th className={cn('h-10 px-2 text-left align-middle font-medium', props.className)} {...props} />
export const TableCell = (props: React.ComponentProps<'td'>) => <td className={cn('p-2 align-middle', props.className)} {...props} />
export const TableCaption = (props: React.ComponentProps<'caption'>) => <caption className={cn('text-muted-foreground mt-4 text-sm', props.className)} {...props} />
