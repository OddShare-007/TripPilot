import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-800 dark:text-brand-300">
        {icon}
      </div>
      <p className="text-sm font-medium text-brand-800 dark:text-brand-100">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-brand-500 dark:text-brand-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
