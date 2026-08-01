import { Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DemoBanner() {
  const { mode } = useAuth()
  const isDemo = mode === 'demo'

  return (
    <div className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium ${isDemo ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200'}`}>
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>
        {isDemo
          ? 'You are in Demo Mode — this data is for demonstration only. Switch to Real Mode in Settings when you are ready to track actual trips.'
          : 'You are in Real Mode — your trips and passengers are stored separately from Demo Mode data.'}
      </span>
    </div>
  )
}
