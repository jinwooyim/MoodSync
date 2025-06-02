// lib/api/base.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485', // Spring Boot API 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  error => {
    // 공통 에러 처리 (예: 401 Unauthorized 시 로그인 페이지로 리다이렉트)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting to login...');
      // window.location.href = '/login'; // 클라이언트 사이드에서만 가능
    }
    return Promise.reject(error);
  }
);

export default api;