import {useEffect, useRef, useState} from 'react'
import VideoPlayer from '../components/stream/VideoPlayer'
import CaptureButton from '../components/stream/CaptureButton'
import useStream from '../hooks/useStream'
import { triggerCapture, verifyFacesInFrame } from '../services/captureService'

export default function StreamPage() {
  const { streamUrl, loading, error } = useStream()
  const [captureLoading, setCaptureLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false) // Nouvel état pour le bouton vérifier
  const [message, setMessage] = useState('')
  const [facesData, setFacesData] = useState([]) // Stockage des visages détectés
  const [webcamStream, setWebcamStream] = useState(null)
  const videoPlayerRef = useRef(null)   // On crée une référence pour pouvoir appeler captureFrame() dans l'enfant
  const timerRef = useRef(null) // --- Référence pour le timer de disparition ---

  // Nettoyage du timer si on quitte la page
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

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

  async function handleVerifyFaces() {
    try {
      // Si un timer est déjà en cours, on l'annule
      if (timerRef.current) clearTimeout(timerRef.current)

      setVerifyLoading(true)
      setMessage('Analyse en cours...')
      setFacesData([]) // On efface les anciens rectangles

      // 1. On ordonne au lecteur vidéo d'extraire la frame actuelle
      const imageBlob = await videoPlayerRef.current?.captureFrame()

      if (!imageBlob) {
        setMessage('Erreur: Impossible de capturer le flux.')
        return
      }

      // 2. On envoie l'image à Python
      const result = await verifyFacesInFrame(imageBlob)

      // 3. On enregistre les données reçues, ce qui va déclencher le dessin sur le canvas
      setFacesData(result.faces_detected)

      if (result.faces_detected && result.faces_detected.length > 0) {
        setMessage(`${result.faces_detected.length} visage(s) détecté(s).`)
        timerRef.current = setTimeout(() => {
          setFacesData([])
          setMessage('')
        }, 5000)
      } else {
        setMessage('Aucun visage détecté.')
      }

    } catch (err) {
      console.error(err)
      setMessage('Erreur lors de la vérification des visages.')
    } finally {
      setVerifyLoading(false)
    }
  }

  function stopWebcam() {
    if (webcamStream) {
      // On arrête proprement les pistes matérielles (éteint la LED de la caméra)
      webcamStream.getTracks().forEach(track => track.stop())
      setWebcamStream(null)
      setFacesData([]) // On nettoie les cadres au cas où
      setMessage('Retour au flux ESP32.')
    }
  }

  async function startWebcam() {
    try {
      // Demande l'autorisation au navigateur d'utiliser la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setWebcamStream(stream)
      setMessage('Webcam activée.')
    } catch (err) {
      console.error(err)
      setMessage('Erreur: Impossible d\'accéder à la webcam.')
    }
  }

  const activeStream = webcamStream || streamUrl

  return (
      <div className="space-y-4">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-3">
            <h2 className="text-base font-semibold">Flux vidéo</h2>
            {webcamStream ? (
                <button
                    onClick={stopWebcam}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
                >
                  🔄 Revenir à l'ESP32
                </button>
            ) : (
                <button
                    onClick={startWebcam}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  📷 Tester avec ma webcam
                </button>
            )}
          </div>

          {loading && !webcamStream ? (
              <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 text-sm text-slate-400">
                Chargement du flux...
              </div>
          ) : (
              <VideoPlayer
                  ref={videoPlayerRef}
                  streamUrl={activeStream}
                  facesData={facesData}
              />
          )}

          {error && !webcamStream && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-200">Actions</h3>

          {/* On aligne les deux boutons horizontalement */}
          <div className="flex flex-wrap gap-3">
            <CaptureButton onClick={handleCapture} loading={captureLoading} />

            {/* Nouveau bouton (j'utilise un style natif, libre à toi d'en faire un composant) */}
            <button
                onClick={handleVerifyFaces}
                disabled={verifyLoading || !activeStream}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {verifyLoading ? 'Vérification...' : 'Vérifier les visages'}
            </button>
          </div>

          {message && <p className="mt-3 text-sm text-slate-300">{message}</p>}
        </section>
      </div>
  )
}