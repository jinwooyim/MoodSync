// lib/api/auth.ts
import api from './base'; // 위에서 정의한 Axios 인스턴스

export const login = async (credentials: { userId: string; userPw: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};