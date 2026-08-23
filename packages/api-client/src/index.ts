import type { AuthCredentials, CreateAccountInput } from '@eggeo/validation';

export type ApiClientOptions = {
  baseUrl: string;
  fetchImpl?: typeof fetch;
};

export type ApiSessionUser = {
  email?: string | null;
  name?: string | null;
  username: string;
};

export type ApiLeaderboardEntry = {
  name: string;
  points: number;
};

export type ApiScore = {
  points: number;
};

export type ApiStatusResponse = {
  status: 'ok';
};

export type ApiEggLocation = {
  lat: number | string;
  lng: number | string;
};

export type ApiEgg = {
  id: string;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  eventId?: string | null;
  points?: number | null;
  coords?: ApiEggLocation | null;
  isCollected?: boolean | null;
};

export type ApiEvent = {
  id: string;
  title: string;
  description?: string | null;
  username?: string | null;
  eggCount?: number;
  isOwner?: boolean;
};

export type ApiFoundEgg = {
  Egg: ApiEgg;
};

export type CreateEggsInput = {
  color?: string;
  count: number;
  description: string;
  eventId: string;
  points: number;
  title: string;
};

export type CreateEventInput = {
  description?: string;
  title: string;
};

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

function getSetCookieHeaders(headers: Headers) {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.();
  if (getSetCookie?.length) return getSetCookie;

  const setCookie = headers.get('set-cookie');
  return setCookie ? [setCookie] : [];
}

export function createApiClient({ baseUrl, fetchImpl = fetch }: ApiClientOptions) {
  let cookieHeader: string | undefined;

  function storeSessionCookie(headers: Headers) {
    for (const setCookie of getSetCookieHeaders(headers)) {
      const cookie = setCookie.split(';', 1)[0];

      if (!cookie || !cookie.startsWith('eggeo_session=')) {
        continue;
      }

      cookieHeader = /;\s*max-age=0\b/i.test(setCookie) || cookie === 'eggeo_session=' ? undefined : cookie;
    }
  }

  async function request<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);

    if (body && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }

    if (cookieHeader && !headers.has('cookie')) {
      headers.set('cookie', cookieHeader);
    }

    const response = await fetchImpl(joinUrl(baseUrl, path), {
      ...init,
      credentials: 'include',
      method: init?.method ?? (body ? 'POST' : 'GET'),
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    storeSessionCookie(response.headers);

    const payload = await response.json().catch(() => undefined);

    if (!response.ok) {
      throw new Error(payload?.message ?? 'Request failed.');
    }

    return payload as T;
  }

  return {
    createAccount(input: CreateAccountInput) {
      return request<ApiStatusResponse>('/api/auth/register', input);
    },
    getLeaderboard(eventId?: string) {
      const params = new URLSearchParams();

      if (eventId) {
        params.set('eventId', eventId);
      }

      return request<ApiLeaderboardEntry[]>(`/api/leaderboard${params.size ? `?${params}` : ''}`);
    },
    getMe() {
      return request<{ user: ApiSessionUser | null }>('/api/auth/me');
    },
    getEvents() {
      return request<ApiEvent[]>('/api/events');
    },
    createEvent(input: CreateEventInput) {
      return request<ApiEvent>('/api/events', input);
    },
    deleteEvent(id: string) {
      return request<{ deleted: boolean }>(`/api/events/${id}`, undefined, { method: 'DELETE' });
    },
    joinEvent(id: string) {
      return request<ApiEvent>(`/api/events/${id}/join`, {});
    },
    getUserEggs(eventId?: string) {
      const params = new URLSearchParams();

      if (eventId) {
        params.set('eventId', eventId);
      }

      return request<ApiEgg[]>(`/api/user-eggs${params.size ? `?${params}` : ''}`);
    },
    getNearbyEggs(coords: ApiEggLocation, eventId?: string) {
      const params = new URLSearchParams({
        lat: String(coords.lat),
        lng: String(coords.lng),
      });

      if (eventId) {
        params.set('eventId', eventId);
      }

      return request<ApiEgg[]>(`/api/eggs/nearby?${params}`);
    },
    getScore(eventId?: string) {
      const params = new URLSearchParams();

      if (eventId) {
        params.set('eventId', eventId);
      }

      return request<ApiScore>(`/api/score${params.size ? `?${params}` : ''}`);
    },
    createEggs(input: CreateEggsInput) {
      return request<{ created: number }>('/api/eggs', input);
    },
    deleteEgg(id: string) {
      return request<{ deleted: boolean }>(`/api/eggs/${id}`, undefined, { method: 'DELETE' });
    },
    findEgg(id: string) {
      return request<ApiFoundEgg>(`/api/eggs/${id}/find`, {});
    },
    collectEgg(id: string) {
      return request<ApiEgg>(`/api/eggs/${id}/collect`, {});
    },
    hideEgg(id: string, coords: ApiEggLocation) {
      return request<ApiEggLocation>(`/api/eggs/${id}/hide`, { coords });
    },
    login(input: AuthCredentials) {
      return request<ApiStatusResponse>('/api/auth/login', input);
    },
    logout() {
      return request<ApiStatusResponse>('/api/auth/logout', undefined, { method: 'POST' });
    },
    deleteAccount() {
      return request<ApiStatusResponse>('/api/auth/account', undefined, { method: 'DELETE' });
    },
    resetScore(eventId: string) {
      const params = new URLSearchParams({ eventId });

      return request<ApiScore>(`/api/score?${params}`, undefined, { method: 'DELETE' });
    },
    request,
  };
}

export type EggeoApiClient = ReturnType<typeof createApiClient>;
