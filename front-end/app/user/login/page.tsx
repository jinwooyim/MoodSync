// app/user/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { login } from '@/lib/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트

export default function UserLoginPage() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ⭐️ 수정: useAuthStore 셀렉터 함수를 최적화하여 getSnapshot 경고를 피합니다.
  // 필요한 상태만 구조분해 할당으로 가져오되, 셀렉터 함수는 useCallback으로 메모이제이션하거나
  // 아예 분리된 useStore를 사용하거나, 단순히 필요한 상태만 나열하는 방식으로 작성합니다.
  // 여기서는 명확성을 위해 각 상태를 개별적으로 가져오는 방식을 사용합니다.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authLoading = useAuthStore((state) => state.loading);
  const loginSuccess = useAuthStore((state) => state.loginSuccess); // loginSuccess도 가져옵니다.

  // ⭐️ 수정: useEffect 로직 개선
  useEffect(() => {
    // authLoading이 false (초기 인증 확인 완료)이고, isLoggedIn이 true이면 리다이렉트
    // 로그인 페이지는 로그인이 되어있지 않을 때만 보여져야 합니다.
    // 따라서, 로그인 성공 후에는 이 페이지가 아니라 다른 페이지로 보내야 합니다.
    if (!authLoading && isLoggedIn) {
      router.replace('/record'); // 이미 로그인된 상태이므로 /record로 이동
    }
  }, [isLoggedIn, authLoading, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login({ userId, userPw });
      // ⭐️ loginSuccess 함수 호출 누락된 부분 수정 (주석 해제 또는 추가)
      loginSuccess(userData); // 로그인 성공 시 전역 상태 업데이트

      // ⭐️ 로그인 성공 후 즉시 리다이렉트
      router.push('/'); // 메인 페이지 또는 적절한 로그인 후 페이지로 리디렉션
    } catch (err: any) {
      console.error("로그인 에러:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ 수정: authLoading이 true이면 로딩 메시지를 보여주고, 그 외에는 isLoggedIn 상태에 따라 렌더링
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>로그인 상태 확인 중...</p>
      </div>
    );
  }

  // ⭐️ 수정: authLoading이 false인데 isLoggedIn이 true인 경우, 이미 useEffect에서 리다이렉트되었을 것이므로
  // 이 페이지는 렌더링할 필요가 없습니다. (혹시 모를 경우를 대비한 방어 코드)
  if (isLoggedIn) {
      return null;
  }

  // isLoggedIn이 false일 때만 로그인 폼을 렌더링
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
        {error && <div className="mb-4 text-red-500 text-sm font-medium">{error}</div>}
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
          MoodSync 회원이 아니신가요?{' '}
          <Link href="/user/join" className="text-blue-700 underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}