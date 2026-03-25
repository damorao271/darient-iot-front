import { Link } from 'react-router-dom'

export function AppSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-900">
          Technical Assesment
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">DANIEL MORAO NISHIMURA</p>
      </div>
      <nav className="flex-1 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-violet-50 text-violet-700 font-medium text-sm border-l-2 border-violet-600 -ml-px pl-4"
        >
          Locations
        </Link>
      </nav>
    </aside>
  )
}
