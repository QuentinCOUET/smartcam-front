import { useEffect, useState } from 'react'
import { getStreamInfo } from '../services/streamService'

export default function useStream() {
  const [streamUrl, setStreamUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStream() {
      try {
        setLoading(true)
        setError('')
        const data = await getStreamInfo()
        setStreamUrl(data.streamUrl || '')
      } catch (err) {
        setError('Impossible de charger le flux vidéo.')
      } finally {
        setLoading(false)
      }
    }

    loadStream()
  }, [])

  return { streamUrl, loading, error }
}