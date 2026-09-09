import { createApiClient } from '@eggeo/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAccountStorage } from './accountStorage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_APP_URL ?? 'http://localhost:3000';
export const api = createApiClient({ baseUrl: API_BASE_URL, requestTimeoutMs: 8000 });
export const accountStorage = createAccountStorage(AsyncStorage);
