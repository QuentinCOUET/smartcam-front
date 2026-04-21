import {apiFetch, pythonApiFetch} from './api'

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
  // On s'assure d'envoyer le blob sous le nom 'file'
  formData.append('file', imageBlob, 'frame.jpg')

  // On utilise notre belle méthode centralisée
  return await pythonApiFetch('/recognize', {
    method: 'POST',
    body: formData,
  })
}