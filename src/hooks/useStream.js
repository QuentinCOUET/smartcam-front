import { useEffect, useState } from 'react'
import { getCam } from '../services/camService'

export default function useStream() {
  const [streamUrl, setStreamUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cam, setCam] = useState(null)

  useEffect(() => {
    async function loadCam() {
      try {
        setLoading(true)
        setError('')

        const data = await getCam()

        setCam(data)
        setStreamUrl(data.videoUrl || '')
      } catch (err) {
        setError('Impossible de charger la caméra.')
      } finally {
        setLoading(false)
      }
    }

    loadCam()
  }, [])

  return { cam, streamUrl, loading, error }
}