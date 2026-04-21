import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const VideoPlayer = forwardRef(({ streamUrl, facesData }, ref) => {
    // On crée deux références distinctes selon le média affiché
    const videoRef = useRef(null)
    const imgRef = useRef(null)
    const canvasRef = useRef(null)

    // On détermine le type de flux actuel
    const isWebcam = streamUrl instanceof MediaStream
    const isEsp32 = typeof streamUrl === 'string'

    // --- Gestion du flux de la Webcam ---
    useEffect(() => {
        if (isWebcam && videoRef.current) {
            videoRef.current.srcObject = streamUrl
        }
    }, [streamUrl, isWebcam])

    // --- Fonction de capture adaptative ---
    useImperativeHandle(ref, () => ({
        captureFrame: () => {
            return new Promise((resolve) => {
                let mediaElement
                let width, height

                // On récupère le bon élément et ses dimensions selon le flux actif
                if (isWebcam && videoRef.current) {
                    mediaElement = videoRef.current
                    width = mediaElement.videoWidth
                    height = mediaElement.videoHeight
                } else if (isEsp32 && imgRef.current) {
                    mediaElement = imgRef.current
                    width = mediaElement.naturalWidth
                    height = mediaElement.naturalHeight
                }

                if (!mediaElement || !width || !height) return resolve(null)

                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = width
                tempCanvas.height = height
                const ctx = tempCanvas.getContext('2d')
                ctx.drawImage(mediaElement, 0, 0, width, height)

                tempCanvas.toBlob((blob) => {
                    resolve(blob)
                }, 'image/jpeg', 0.9)
            })
        }
    }))

    // --- Dessin des rectangles adaptatif ---
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        let width, height
        if (isWebcam && videoRef.current) {
            width = videoRef.current.videoWidth || 640
            height = videoRef.current.videoHeight || 480
        } else if (isEsp32 && imgRef.current) {
            width = imgRef.current.naturalWidth || 640
            height = imgRef.current.naturalHeight || 480
        } else {
            return
        }

        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height
        ctx.clearRect(0, 0, width, height)

        if (facesData && facesData.length > 0) {
            facesData.forEach((face) => {
                const { top, right, bottom, left } = face.box
                ctx.strokeStyle = '#22c55e'
                ctx.lineWidth = 3
                ctx.strokeRect(left, top, right - left, bottom - top)
                ctx.fillStyle = '#22c55e'
                ctx.fillRect(left, top - 30, right - left, 30)
                ctx.fillStyle = '#000000'
                ctx.font = 'bold 18px Arial'
                const text = `${face.name} (${face.confidence}%)`
                ctx.fillText(text, left + 5, top - 8)
            })
        }
    }, [facesData, isWebcam, isEsp32])

    if (!streamUrl) {
        return (
            <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900 text-sm text-slate-400">
                Aucun flux disponible
            </div>
        )
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black">

            {/* Affichage conditionnel selon le type de flux */}
            {isWebcam ? (
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="aspect-[16/9] w-full object-cover"
                />
            ) : (
                <img
                    ref={imgRef}
                    src={streamUrl}
                    crossOrigin="anonymous"
                    alt="Flux ESP32"
                    className="aspect-[16/9] w-full object-cover"
                />
            )}

            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
        </div>
    )
})

VideoPlayer.displayName = 'VideoPlayer'
export default VideoPlayer