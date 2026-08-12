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
  points?: number | null;
  coords?: ApiEggLocation | null;
  isCollected?: boolean | null;
};

export type ApiFoundEgg = {
  Egg: ApiEgg;
};

export type CreateEggsInput = {
  color?: string;
  count: number;
  description: string;
  points: number;
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
    getUserEggs() {
      return request<ApiEgg[]>('/api/user-eggs');
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
