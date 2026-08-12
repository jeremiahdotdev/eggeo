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

export function createApiClient({ baseUrl, fetchImpl = fetch }: ApiClientOptions) {
  async function request<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const response = await fetchImpl(joinUrl(baseUrl, path), {
      credentials: 'include',
      method: body ? 'POST' : 'GET',
      headers: body ? { 'content-type': 'application/json', ...init?.headers } : init?.headers,
      body: body ? JSON.stringify(body) : undefined,
      ...init,
    });

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
    getLeaderboard() {
      return request<ApiLeaderboardEntry[]>('/api/leaderboard');
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
    getScore() {
      return request<ApiScore>('/api/score');
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
    resetScore() {
      return request<ApiScore>('/api/score', undefined, { method: 'DELETE' });
    },
    request,
  };
}

export type EggeoApiClient = ReturnType<typeof createApiClient>;
