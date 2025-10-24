// Centralized API fetch with base URL and robust JSON/text handling
const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function apiFetch(path, opts = {}) {
  const url = base ? `${base}${path}` : path;
  const hasBody = opts.body !== undefined && opts.body !== null;
  const res = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {})
    }
  });

  // Try to parse JSON, but don’t explode if not JSON
  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch {}
  } else {
    try { data = await res.text(); } catch {}
  }

  if (!res.ok) {
    const msg = typeof data === 'object' && data
      ? (data.error || data.message || `HTTP ${res.status}`)
      : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
