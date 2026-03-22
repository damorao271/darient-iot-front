export function RegisterPlaceCard() {
  return (
    <article className="bg-violet-50/60 border-2 border-dashed border-violet-200 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 min-h-[320px]">
      <button
        type="button"
        className="mb-4 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Interactive Map
      </button>
      <h3 className="text-slate-900 font-semibold mb-1">Grow your portfolio</h3>
      <p className="text-slate-600 text-sm text-center max-w-[220px] mb-5">
        Can&apos;t find a building? Integrate a new property into the Architect system.
      </p>
      <button
        type="button"
        className="py-2 px-5 rounded-lg border-2 border-violet-300 text-violet-700 text-sm font-medium hover:bg-violet-100 transition-colors"
      >
        Register Building
      </button>
    </article>
  )
}
