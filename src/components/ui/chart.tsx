'use client'

import * as React from 'react'
import * as RechartsPrimitive from 'recharts'

import { cn } from '@/components/ui/utils'

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<keyof typeof THEMES, string>
  }
}

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)
function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used within a <ChartContainer />')
  return ctx
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} className={cn('flex aspect-video justify-center text-xs', className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, c]) => c.theme || c.color)
  if (!entries.length) return null
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `${prefix} [data-chart=${id}] {\n${entries.map(([k, c]) => `  --color-${k}: ${c.theme?.[theme as 'light' | 'dark'] ?? c.color};`).join('\n')}\n}`)
          .join('\n'),
      }}
    />
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip
export const ChartLegend = RechartsPrimitive.Legend
export function ChartTooltipContent(
  props: React.ComponentProps<'div'> &
    React.ComponentProps<typeof RechartsPrimitive.Tooltip> & {
      payload?: unknown[]
      active?: boolean
    },
) {
  const { active, payload, className } = props
  useChart()
  if (!active || !payload?.length) return null
  return <div className={cn('bg-background border-border/50 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl', className)}>...</div>
}
export function ChartLegendContent(props: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-center gap-4', props.className)}>{props.children}</div>
}
