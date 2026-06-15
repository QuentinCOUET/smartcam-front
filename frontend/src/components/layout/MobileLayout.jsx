import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
                SmartCam
              </p>
              <h1 className="text-lg font-semibold">Surveillance</h1>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              Mobile
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-4 pb-24">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  )
}