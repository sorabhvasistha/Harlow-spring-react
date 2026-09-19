export async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const body = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(body?.message || 'Something went wrong. Please try again.')
  return body
}
