const ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';
export async function Log(level, pkg, message, token) {
  const body = {
    stack: 'frontend',
    level: String(level || '').toLowerCase(),
    package: String(pkg || '').toLowerCase(),
    message: String(message || '')
  };

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`log failed: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}
export default Log;