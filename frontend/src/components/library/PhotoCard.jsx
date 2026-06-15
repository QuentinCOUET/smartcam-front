export default function PhotoCard({ photo }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <img
        src={photo.imageUrl}
        alt={photo.name || 'Capture'}
        className="aspect-square w-full object-cover"
      />
      <div className="p-3">
        <p className="truncate text-sm font-medium text-slate-100">
          {photo.name || 'Capture'}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {photo.createdAt || 'Date inconnue'}
        </p>
      </div>
    </article>
  )
}