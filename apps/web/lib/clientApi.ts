export async function apiRequest<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Request failed.');
  }

  return payload as T;
}
