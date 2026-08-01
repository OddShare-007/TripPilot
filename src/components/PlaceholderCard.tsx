import type { ReactNode } from 'react'

interface PlaceholderCardProps {
  title: string
  description: string
  icon?: ReactNode
  className?: string
  tall?: boolean
}

export default function PlaceholderCard({
  title,
  description,
  icon,
  className = '',
  tall = false,
}: PlaceholderCardProps) {
  return (
    <div className={`card p-5 ${tall ? 'min-h-[220px]' : 'min-h-[160px]'} ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center gap-3 rounded-lg border border-dashed border-surface-border bg-surface-muted/50 px-3 py-2.5"
          >
            <div className="h-2 flex-1 rounded bg-brand-100" style={{ width: `${70 - row * 10}%` }} />
            <div className="h-2 w-12 rounded bg-brand-50" />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-brand-400">{description}</p>
    </div>
  )
}
