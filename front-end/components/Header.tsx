// components/Header.tsx
'use client';

import { Heart } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore'; // Zustand 스토어 임포트

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loading = useAuthStore((state) => state.loading); // 스토어에서 로딩 상태 가져오기
  const logoutUser = useAuthStore((state) => state.logoutUser); // 스토어에서 로그아웃 함수 가져오기
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser(); // Zustand 스토어의 로그아웃 함수 호출
    router.push('/user/login'); // 로그인 페이지로 리다이렉트
  };

  if (loading) {
    // 로딩 중일 때 표시할 내용 (헤더는 고정하고 링크만 다르게)
    return (
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoodSync
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">홈</Link>
              <Link href="/recommendations" className="text-gray-600 hover:text-gray-900 transition-colors">추천</Link>
              <Link href="/record" className="text-gray-600 hover:text-gray-900 transition-colors">내 기록</Link>
              <span className="text-gray-400">인증 중...</span>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">설정</Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoodSync
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              홈
            </Link>
            <Link href="/recommendations" className="text-gray-600 hover:text-gray-900 transition-colors">
              추천
            </Link>
            <Link href="/record" className="text-gray-600 hover:text-gray-900 transition-colors">
              내 기록
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                로그아웃
              </button>
            ) : (
              <Link href="/user/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                로그인
              </Link>
            )}

            <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
              설정
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}