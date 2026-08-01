import type { ReactNode } from 'react'
import EmptyState from './EmptyState'
import { BarChart3 } from 'lucide-react'

interface BarChartProps {
  title: string
  icon?: ReactNode
  data: { label: string; value: number }[]
  valuePrefix?: string
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export default function BarChart({
  title,
  icon,
  data,
  valuePrefix = '',
  emptyTitle = 'No data yet',
  emptyDescription = 'Add trips to see insights here.',
  className = '',
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={`card flex flex-col ${className}`}>
      <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3 dark:border-brand-800">
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100">{title}</h3>
      </div>
      <div className="flex-1 p-4">
        {data.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="h-5 w-5" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <div className="flex h-44 items-end gap-3">
            {data.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
                  {valuePrefix}
                  {d.value.toLocaleString()}
                </span>
                <div
                  className="w-full rounded-t-md bg-brand-400 transition-all dark:bg-brand-500"
                  style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-brand-500 dark:text-brand-400">{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
