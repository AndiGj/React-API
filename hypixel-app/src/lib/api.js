// Centralized API fetch with base URL and robust JSON/text handling
function sanitizeBaseUrl(raw) {
  if (!raw) return '';
  let s = String(raw).trim();
  // strip surrounding quotes if present
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = s.trim();
  // remove a single trailing slash
  s = s.replace(/\/$/, '');
  return s;
}
const API_BASE = sanitizeBaseUrl(import.meta.env.VITE_API_URL);

async function parseBody(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await res.json(); } catch { return null; }
  }
  try {
    const text = await res.text();
    return text ? { message: text } : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const data = await parseBody(res);
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

export { API_BASE };
