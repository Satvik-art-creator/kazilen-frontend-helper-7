// app/lib/api.js
const DEFAULT_BASE = 'http://localhost:8080'
const BASE = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE).replace(/\/+$/, '')
const DEFAULT_TIMEOUT_MS = 12000

const buildUrl = (path) => {
  if (!path.startsWith('/')) path = '/' + path
  return `${BASE}${path}`
}

async function _fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { mode: 'cors', ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

async function jsonOrNull(res) {
  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

async function api(
  path,
  { method = 'GET', body, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS, credentials = 'include' } = {}
) {
  const url = buildUrl(path)
  const finalHeaders = { ...headers }
  let finalBody = body

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body && !isFormData && typeof body === 'object') {
    finalHeaders['Content-Type'] = 'application/json'
    finalBody = JSON.stringify(body)
  }
  if (isFormData || method === 'GET') {
    delete finalHeaders['Content-Type']
  }

  const fetchOptions = {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials,
    cache: 'no-store',
  }

  let res
  try {
    res = await _fetchWithTimeout(url, fetchOptions, timeoutMs)
  } catch (err) {
    const e = new Error(err?.message || 'Network error')
    e.status = null
    e.data = null
    throw e
  }

  const data = await jsonOrNull(res)

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `${res.status} ${res.statusText}`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  if (res.status === 204) return null
  return data ?? null
}

/* ---------- Items API (with professionalId support) ---------- */

/**
 * Helper: read professional id from localStorage (if present)
 */
function getStoredProfessionalId() {
  if (typeof window === 'undefined') return null
  return (
    localStorage.getItem('kazilen_professional_id') ||
    localStorage.getItem('professionalId') ||
    localStorage.getItem('kazilen_user_id') ||
    null
  )
}

/** createItem(payload, professionalIdOptional) */
export async function createItem(payload, professionalId) {
  if (!payload || !payload.name) throw new Error('payload.name required')
  // prefer explicit professionalId param, else use stored id
  const profId = professionalId ?? getStoredProfessionalId()
  const path = profId ? `/api/items?actingProfessionalId=${encodeURIComponent(profId)}` : `/api/items`
  return api(path, { method: 'POST', body: payload })
}

/** listItems(professionalIdOptional) */
export async function listItems(professionalId) {
  const profId = professionalId ?? getStoredProfessionalId()
  const path = profId ? `/api/items?professionalId=${encodeURIComponent(profId)}` : `/api/items`
  return api(path, { method: 'GET' })
}

/** getItem(id) */
export async function getItem(id) {
  if (!id) throw new Error('id required')
  return api(`/api/items/${encodeURIComponent(id)}`, { method: 'GET' })
}

/** updateItem(id, payload, actingProfessionalIdOptional) */
export async function updateItem(id, payload, actingProfessionalId) {
  if (!id) throw new Error('id required')
  if (!payload || !payload.name) throw new Error('payload.name required')
  const profId = actingProfessionalId ?? getStoredProfessionalId()
  const path = profId ? `/api/items/${encodeURIComponent(id)}?actingProfessionalId=${encodeURIComponent(profId)}` : `/api/items/${encodeURIComponent(id)}`
  return api(path, { method: 'PUT', body: payload })
}

/** deleteItem(id, actingProfessionalIdOptional) */
export async function deleteItem(id, actingProfessionalId) {
  if (!id) throw new Error('id required')
  const profId = actingProfessionalId ?? getStoredProfessionalId()
  const path = profId ? `/api/items/${encodeURIComponent(id)}?actingProfessionalId=${encodeURIComponent(profId)}` : `/api/items/${encodeURIComponent(id)}`
  return api(path, { method: 'DELETE' })
}

/* -------- Auth helpers (unchanged) -------- */

export async function checkPhone(phone) {
  if (!phone) throw new Error('phone required')
  const encoded = encodeURIComponent(phone)
  return api(`/api/auth/check?phone=${encoded}`, { method: 'GET' })
}

export async function createProfessional(payload) {
  return api('/api/auth/create', { method: 'POST', body: payload })
}

export async function getProfessional(id) {
  if (!id) throw new Error('id required')
  return api(`/api/professionals/${encodeURIComponent(id)}`, { method: 'GET' })
}

export async function updateProfessional(id, payload) {
  if (!id) throw new Error('id required')
  return api(`/api/professionals/${encodeURIComponent(id)}`, { method: 'PUT', body: payload })
}
