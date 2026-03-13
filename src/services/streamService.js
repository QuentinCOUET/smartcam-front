import { apiFetch } from './api'

export async function getStreamInfo() {
  return apiFetch('/stream')
}