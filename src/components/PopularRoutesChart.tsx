import type { RouteCount } from '../lib/tripUtils'
import EmptyState from './EmptyState'
import { MapPin } from 'lucide-react'

interface PopularRoutesChartProps {
  data: RouteCount[]
}

export default function PopularRoutesChart({ data }: PopularRoutesChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="card">
      <div className="flex items-center gap-2 border-b border-surface-border px-4 py-3 dark:border-brand-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300">
          <MapPin className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-brand-900 dark:text-brand-100">
          Popular routes
        </h3>
      </div>
      <div className="p-4">
        {data.length === 0 ? (
          <EmptyState
            icon={<MapPin className="h-5 w-5" />}
            title="No routes yet"
            description="Your most-travelled routes will appear here."
          />
        ) : (
          <div className="space-y-3">
            {data.map((d) => (
              <div key={d.route}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-brand-800 dark:text-brand-200">{d.route}</span>
                  <span className="text-brand-500">{d.count} trip{d.count !== 1 ? 's' : ''}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-800">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${(d.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
