export interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T;
}

export async function api<T = any>(
  action: string,
  opts: { method?: 'GET' | 'POST'; id?: string; body?: unknown } = {},
): Promise<ApiResult<T & { error?: string }>> {
  const method = opts.method || (opts.body !== undefined ? 'POST' : 'GET');
  const qs = new URLSearchParams({ action });
  if (opts.id) qs.set('id', opts.id);
  try {
    const res = await fetch(`/api/crm?${qs.toString()}`, {
      method,
      credentials: 'same-origin',
      headers: method === 'GET' ? {} : { 'Content-Type': 'application/json', 'x-crm': '1' },
      body: method === 'GET' ? undefined : JSON.stringify(opts.body ?? {}),
    });
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON error page */
    }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'No connection. Please check your internet and try again.' } as any };
  }
}
