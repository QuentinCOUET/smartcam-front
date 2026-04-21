import { apiFetch } from './api'

export async function getCam() {
  return apiFetch('/cam')
}

export async function updateCam(payload) {
  return apiFetch('/cam', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}