import PhotoCard from './PhotoCard'

export default function PhotoGrid({ photos }) {
  if (!photos.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-6 text-center text-sm text-slate-400">
        Aucune capture disponible.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}