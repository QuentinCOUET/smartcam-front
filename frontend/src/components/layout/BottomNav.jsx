import { NavLink } from 'react-router-dom'

const baseClass =
  'rounded-2xl px-4 py-3 text-sm font-medium text-center transition'
const activeClass = 'bg-emerald-500 text-slate-950'
const inactiveClass = 'border border-slate-800 bg-slate-900 text-slate-200'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/95 px-3 py-3 backdrop-blur">
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-3">
        <NavLink
          to="/stream"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Flux
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Bibliothèque
        </NavLink>

        <NavLink
          to="/config"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Config
        </NavLink>
      </div>
    </nav>
  )
}