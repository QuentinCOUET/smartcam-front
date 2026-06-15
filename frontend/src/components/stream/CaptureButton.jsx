export default function CaptureButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full rounded-2xl bg-emerald-500 px-4 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? 'Capture en cours...' : 'Prendre une capture'}
    </button>
  )
}