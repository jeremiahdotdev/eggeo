import { createApiClient } from '@eggeo/api-client';

export const API_BASE_URL = 'http://localhost:3000';

export const api = createApiClient({ baseUrl: API_BASE_URL });
