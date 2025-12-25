
import axios from 'axios';

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/auth`, // → /api/auth
  withCredentials: true,
});

export const login = (email: string, password: string) =>
  authApi.post('/login', { email, password });

export const getCurrentUser = () => authApi.get('/me');