// app/user/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { login } from '@/lib/api/auth'; // getCurrentUser는 이제 스토어에서 처리
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트

export default function UserLoginPage() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 폼 제출 로딩
  const router = useRouter();

  const { isLoggedIn, checkAuthStatus, loginSuccess } = useAuthStore(); // Zustand 스토어에서 가져오기
  const authLoading = useAuthStore((state) => state.loading); // 초기 인증 확인 로딩 상태

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    // 스토어의 checkAuthStatus는 앱 초기 로드 시 `AuthInitializer`에서 호출됨.
    // 여기서는 이미 로그인 상태라면 바로 리다이렉트
    if (isLoggedIn && !authLoading) { // authLoading이 false일 때만 리다이렉트 (초기 확인 완료 후)
      router.replace('/record');
    }
  }, [isLoggedIn, authLoading, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login({ userId, userPw }); // 로그인 API 호출
      loginSuccess(userData); // 로그인 성공 시 전역 상태 업데이트
      router.push('/'); // 메인 페이지로 리디렉션
    } catch (err: any) {
      console.error("로그인 에러:", err);
      setError(err.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 인증 상태 확인 중일 때는 스피너 또는 아무것도 렌더링하지 않음
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로그인 상태 확인 중...</p>
      </div>
    );
  }

  // 이미 로그인되어 있으면 (checkAuthStatus에서 리다이렉트 되었을 것이므로)
  // 이 부분은 사실상 도달하지 않을 것이지만, 만약을 대비하여...
  if (isLoggedIn) {
     return null; // 또는 다른 로딩/리다이렉트 메시지
  }


  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">
          <i className="fa-solid fa-train-subway"></i>
        </div>
        <h2 className="text-2xl font-bold">로그인</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="userId" className="block mb-1 font-medium">아이디</label>
          <input
            id="userId"
            name="userId"
            type="text"
            required
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="userPw" className="block mb-1 font-medium">비밀번호</label>
          <input
            id="userPw"
            name="userPw"
            type="password"
            required
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p>
          메트로하우스 회원이 아니신가요?{' '}
          <Link href="/user/join" className="text-blue-700 underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}