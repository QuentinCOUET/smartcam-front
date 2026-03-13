import { useEffect, useState } from 'react'
import { getCaptures } from '../services/captureService'

export default function useCaptures() {
  const [captures, setCaptures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchCaptures() {
    try {
      setLoading(true)
      setError('')
      const data = await getCaptures()
      setCaptures(Array.isArray(data) ? data : data.captures || [])
    } catch (err) {
      setError('Impossible de charger la bibliothèque.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaptures()
  }, [])

  return {
    captures,
    loading,
    error,
    refreshCaptures: fetchCaptures,
  }
}