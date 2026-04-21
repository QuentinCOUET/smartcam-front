import { apiFetch } from './api'

export async function getCam() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                nom: 'Caméra salon',
                videoUrl: 'http://10.0.3.35:81/stream',
                ipCam: '192.168.1.50',
                createdAt: '2026-04-21T13:40:00+00:00',
            })
        }, 800)
    })

//   return apiFetch('/cam')
}

export async function updateCam(payload) {
  return apiFetch('/cam', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}