import { apiFetch } from './api'

export async function triggerCapture() {
  return apiFetch('/captures', {
    method: 'POST',
  })
}

export async function getCaptures() {
  return apiFetch('/captures')
}