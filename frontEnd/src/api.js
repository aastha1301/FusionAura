const host = typeof window !== "undefined" ? window.location.hostname : "localhost"
export const SERVER_URL = `http://${host}:5000`
export const API_URL = `${SERVER_URL}/api`

export async function apiRequest(path, options = {}, token = null) {
  const headers = new Headers(options.headers || {})
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || "Something went wrong.")
  return data
}

export function imageUrl(image) {
  if (!image) return ""
  return image.startsWith("http") ? image : `${SERVER_URL}${image}`
}
