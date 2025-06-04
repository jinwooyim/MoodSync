// components/Header.tsx
// 'use client' // Header에 동적인 요소(useState, onClick 등)가 없다면 서버 컴포넌트로 유지해도 됨.
                  // 현재 Link 컴포넌트가 next/link에서 오므로 클라이언트 컴포넌트일 필요는 없음.
                  // 하지만 필요에 따라 'use client'를 추가할 수 있습니다.
import { Heart } from "lucide-react";
import Link from 'next/link';

export default function Header() {
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
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
              설정
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}