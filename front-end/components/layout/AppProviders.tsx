// components/AppProviders.tsx
// 헤더 풋터 컴포넌트 포함, AuthInitializer 실행한 후 다른 요소들이 출력되도록 함
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/authStore'; // 스토어 경로 확인
import Header from './Header'; // Header 컴포넌트 임포트
import Footer from './Footer'; // Footer 컴포넌트 임포트
import Spinner from '@/components/Spinner'; // ⭐ Spinner 컴포넌트 임포트 ⭐
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider"

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { loading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인을 한 번만 호출합니다.
    // 이 checkAuthStatus는 localStorage에서 토큰을 읽고 서버에 유효성 검사를 요청할 수 있습니다.
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 로딩 중일 때만 스피너와 로딩 메시지
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <Spinner />
        <p className="mt-4 text-lg">인증 상태를 확인 중입니다...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen"> 
        <Header /> 
        <main className="flex-1 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
{loading ? ( // ⭐ 로딩 중일 때만 스피너와 메시지를 main 영역에 표시 ⭐
            <div className="flex flex-col items-center justify-center h-full w-full"> {/* 스피너 컨테이너, main 영역 전체를 채우도록 */}
              <Spinner />
              <p className="mt-4 text-lg">인증 상태를 확인 중입니다...</p>
            </div>
          ) : (
            children // ⭐ 로딩 완료 시에만 자식(페이지/레이아웃) 렌더링 ⭐
          )}
        </main>
        <Footer /> 
      </div>
    </ThemeProvider>
  );
}
