import { apiFetch } from './api'

export async function triggerCapture() {
  return apiFetch('/captures', {
    method: 'POST',
  })
}

export async function getCaptures() {
  return apiFetch('/captures')
}

export async function verifyFacesInFrame(imageBlob) {
  const formData = new FormData()
  // On attache le blob sous le nom "file", comme attendu par FastAPI
  formData.append('file', imageBlob, 'frame.jpg')

  // Pense à remplacer l'URL si ton API n'est pas sur le port 8000
  const response = await fetch('http://127.0.0.1:8000/recognize', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Erreur lors de l'appel à l'API de reconnaissance.")
  }

  return await response.json()
}