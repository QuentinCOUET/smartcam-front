export default function VideoPlayer({ streamUrl }) {
  if (!streamUrl) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900 text-sm text-slate-400">
        Aucun flux disponible
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black">
      <img
        src={streamUrl}
        alt="Flux caméra"
        className="aspect-[16/9] w-full object-cover"
      />
    </div>
  )
}