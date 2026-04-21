import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const VideoPlayer = forwardRef(({ streamUrl, facesData }, ref) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    // On expose une méthode "captureFrame" au composant parent (StreamPage)
    useImperativeHandle(ref, () => ({
        captureFrame: () => {
            return new Promise((resolve) => {
                const video = videoRef.current
                if (!video) return resolve(null)

                // On crée un canvas temporaire pour extraire l'image du flux
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = video.videoWidth
                tempCanvas.height = video.videoHeight
                const ctx = tempCanvas.getContext('2d')
                ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)

                // On convertit l'image en Blob (fichier)
                tempCanvas.toBlob((blob) => {
                    resolve(blob)
                }, 'image/jpeg', 0.9)
            })
        }
    }))

    // Effet pour dessiner les rectangles quand 'facesData' est mis à jour
    useEffect(() => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        const ctx = canvas.getContext('2d')

        // On synchronise la résolution interne du canvas avec celle de la vidéo
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // On efface les anciens dessins
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (facesData && facesData.length > 0) {
            facesData.forEach((face) => {
                const { top, right, bottom, left } = face.box

                // Configuration du style de dessin
                ctx.strokeStyle = '#22c55e' // Vert Tailwind (green-500)
                ctx.lineWidth = 3

                // Dessin du rectangle
                ctx.strokeRect(left, top, right - left, bottom - top)

                // Fond pour le texte
                ctx.fillStyle = '#22c55e'
                ctx.fillRect(left, top - 30, right - left, 30)

                // Texte (Nom et pourcentage)
                ctx.fillStyle = '#000000'
                ctx.font = 'bold 18px Arial'
                const text = `${face.name} (${face.confidence}%)`
                ctx.fillText(text, left + 5, top - 8)
            })
        }
    }, [facesData])

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
})

VideoPlayer.displayName = 'VideoPlayer'
export default VideoPlayer