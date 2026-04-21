const API_BASE_URL = 'http://localhost:8000/api'

const PYTHON_API_URL = 'http://127.0.0.1:8000'

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export async function pythonApiFetch(path, options = {}) {
  const response = await fetch(`${PYTHON_API_URL}${path}`, {
    ...options,
    headers: {
      // On ne force PAS de 'Content-Type' ici.
      // Le navigateur s'en chargera tout seul quand il verra un FormData (pour l'image).
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Python API error: ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}