import { api } from './config';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  logout: () =>
    api.post<{ success: boolean }>('/auth/logout'),

  refreshToken: () =>
    api.post<{ token: string }>('/auth/refresh'),
};