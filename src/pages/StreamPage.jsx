import { useState } from 'react'
import VideoPlayer from '../components/stream/VideoPlayer'
import CaptureButton from '../components/stream/CaptureButton'
import useStream from '../hooks/useStream'
import { triggerCapture } from '../services/captureService'

export default function StreamPage() {
  const { streamUrl, loading, error } = useStream()
  const [captureLoading, setCaptureLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleCapture() {
    try {
      setCaptureLoading(true)
      setMessage('')
      await triggerCapture()
      setMessage('Capture enregistrée avec succès.')
    } catch (err) {
      setMessage('Échec de la capture.')
    } finally {
      setCaptureLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3">
          <h2 className="text-base font-semibold">Flux vidéo</h2>
        </div>

        {loading ? (
          <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 text-sm text-slate-400">
            Chargement du flux...
          </div>
        ) : (
          <VideoPlayer streamUrl={streamUrl} />
        )}

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Actions</h3>
        <CaptureButton onClick={handleCapture} loading={captureLoading} />

        {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
      </section>
    </div>
  )
}