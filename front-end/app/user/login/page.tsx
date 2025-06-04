// app/user/login/page.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useState } from 'react';
import { login } from '@/lib/api/auth'; // auth.ts에서 로그인 함수 임포트
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router 사용 시

export default function UserLoginPage() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 라우터 훅 사용

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setLoading(true); // 로딩 상태 시작
    setError(''); // 이전 에러 메시지 초기화

    try {
      // lib/api/auth.ts의 login 함수 호출
      // Axios가 Content-Type: application/json으로 userId, userPw를 전송
      await login({ userId, userPw });

      // 로그인 성공 시 메인 페이지로 리디렉션
      router.push('/');
    } catch (err: any) {
      console.error("로그인 에러:", err);
      // 서버에서 전달된 에러 메시지가 있다면 사용, 없으면 기본 메시지
      setError(err.response?.data?.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

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
          disabled={loading} // 로딩 중에는 버튼 비활성화
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