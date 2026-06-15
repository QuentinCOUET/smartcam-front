import PhotoGrid from '../components/library/PhotoGrid'
import useCaptures from '../hooks/useCaptures'

export default function LibraryPage() {
  const { captures, loading, error, refreshCaptures } = useCaptures()

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Bibliothèque</h2>
          <button
            onClick={refreshCaptures}
            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200"
          >
            Actualiser
          </button>
        </div>

        {loading && <p className="text-sm text-slate-400">Chargement...</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
        {!loading && !error && <PhotoGrid photos={captures} />}
      </section>
    </div>
  )
}