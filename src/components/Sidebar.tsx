import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Plane,
  Calendar,
  BarChart3,
  MessageSquare,
  PlusCircle,
  Settings,
  HelpCircle,
  Info,
  X,
} from 'lucide-react'

const mainItems = [
  { icon: LayoutDashboard, label: 'Overview', to: '/dashboard' },
  { icon: Plane, label: 'Trips', to: '/trips' },
  { icon: Calendar, label: 'Schedule', to: '/schedule' },
  { icon: BarChart3, label: 'Analytics', to: '/analytics' },
  { icon: MessageSquare, label: 'AI Assistant', to: '/assistant' },
  { icon: PlusCircle, label: 'Add Trip Data', to: '/add-trip' },
]

const utilityItems = [
  { icon: Settings, label: 'Settings', to: '/settings' },
  { icon: HelpCircle, label: 'Help', to: '/help' },
  { icon: Info, label: 'About us', to: '/about' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-800 dark:text-brand-100'
        : 'text-brand-600 hover:bg-brand-50/60 hover:text-brand-800 dark:text-brand-400 dark:hover:bg-brand-800/60 dark:hover:text-brand-100'
    }`

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-surface-border bg-surface shadow-lg shadow-brand-950/5 transition-transform duration-300 ease-in-out dark:border-brand-800 dark:bg-brand-900 lg:static lg:z-auto lg:h-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: 'var(--top-offset, 0px)' }}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Menu</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-800"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4 pt-0 lg:pt-4">
          <p className="mb-3 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-400 lg:block">
            Main Menu
          </p>
          {mainItems.map(({ icon: Icon, label, to }) => (
            <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="my-3 border-t border-surface-border dark:border-brand-800" />

          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-400">
            Support
          </p>
          {utilityItems.map(({ icon: Icon, label, to }) => (
            <NavLink key={label} to={to} className={linkClass} onClick={onClose}>
              <Icon className="h-4 w-4" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}
