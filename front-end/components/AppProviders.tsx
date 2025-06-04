// components/AppProviders.tsx (새 파일 생성)
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import Header from './Header'; // Header 컴포넌트 임포트
import Footer from './Footer'; // Footer 컴포넌트 임포트

// AuthInitializer와 비슷한 역할을 하지만, children을 렌더링하는 시점을 제어
export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { loading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus(); // 앱 시작 시 인증 상태 확인
  }, [checkAuthStatus]);

  // 로딩 중일 때는 로딩 스피너나 빈 화면 등을 보여줍니다.
  // 이 부분이 중요합니다! 로딩이 완료될 때까지 children (즉, 실제 페이지 내용)을 렌더링하지 않습니다.
  // Header는 여기서 로딩 상태를 확인하며 렌더링될 것입니다.
  // 이 부분은 Header에서도 loading을 처리하기 때문에, 여기서는 children이 렌더링되기 전에만
  // 로딩 상태를 보여주는 것으로 충분합니다.
  // if (loading) {
  //   return <div className="min-h-screen flex items-center justify-center">인증 상태 로딩 중...</div>;
  // }

  return (
    <>
      {/* Header는 여기서 로딩 상태를 직접 확인하며 렌더링됩니다. */}
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* AuthStore의 loading 상태가 false가 되어야 children이 렌더링됩니다. */}
        {/* 하지만 Header에서 이미 loading 상태를 처리하고 있으므로,
            여기서 children 렌더링을 막는 것은 불필요하거나 오히려 문제를 야기할 수 있습니다.
            대신, children에 로딩 상태를 전달하거나, Header가 로딩을 처리하도록 맡기는 것이 좋습니다.
            현재 코드에서는 Header가 로딩을 처리하므로, 여기서는 children을 항상 렌더링합니다.
            핵심은 Header가 로딩 중일 때 '로그인/로그아웃' 버튼을 숨기는 것입니다. */}
        {children}
      </div>
      <Footer />
    </>
  );
}