// lib/api/auth.ts
import api from './base';

interface LoginCredentials {
  userId: string;
  userPw: string;
}

// 로그인 함수
export const login = async (credentials: LoginCredentials) => {
  // 백엔드로 userId와 userPw를 JSON 형태로 전송
  const response = await api.post('/user/login', credentials); // 경로에 슬래시 추가
  return response.data; // 서버에서 로그인 성공 응답을 반환
};

// 로그아웃 함수
export const logout = async () => {
  try {
    // 백엔드 /logout 엔드포인트 호출
    // Spring Security 설정에 따라 이 요청이 jwt_token 쿠키를 만료시킬 것입니다.
    await api.post('/user/logout'); // 경로에 슬래시 추가
    console.log("서버 로그아웃 요청 성공: HttpOnly 쿠키 만료 예정.");
  } catch (error) {
    console.error("서버 로그아웃 요청 실패:", error);
    // 실패하더라도 클라이언트 측에서 상태를 초기화하고 리디렉션하는 것이 사용자 경험에 좋습니다.
  } finally {
    // HttpOnly 쿠키는 클라이언트 JS에서 직접 제거할 수 없으므로,
    // 이 코드에서는 클라이언트 측 쿠키 제거 로직이 없습니다.
    // 브라우저가 서버의 Set-Cookie 응답을 받아 쿠키를 처리할 것입니다.
  }
};

export const getCurrentUser = async () => {
  // 이 엔드포인트는 인증된 사용자만 접근 가능합니다.
  // 브라우저가 자동으로 jwt_token 쿠키를 이 요청에 포함시켜 서버로 보냅니다.
  const response = await api.get('/user/me'); // 경로에 슬래시 추가
  return response.data; // 사용자 정보를 담은 데이터를 반환한다고 가정
};

export const register = async (joinData: any) => {
  // x-www-form-urlencoded 방식으로 전송 (qs 없이 URLSearchParams 사용)
  const params = new URLSearchParams(joinData).toString();
  const response = await api.post(
    '/joinProc',
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
};