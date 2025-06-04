import type { Metadata } from 'next'
import AuthInitializer from '@/components/AuthInitializer';
import './globals.css'

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MoodSync - 당신의 감정을 동기화하세요",
  description: "감정에 맞는 음악과 활동을 추천해주는 MoodSync 앱",
  keywords: ["감정", "음악 추천", "활동 추천", "무드", "MoodSync"],
  // generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 다음 지도 API 스크립트 - <head> 태그에 직접 추가 (권장) */}
        {/* postcode.v2.js는 페이지 로드 시점에 필요하고, 다른 스크립트보다 먼저 로드될 필요가 있습니다. */}
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async defer></script>

        {/* 비밀번호 눈 아이콘 (Ionicons) CSS - <head> 태그에 직접 추가 */}
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />

        {/* 기타 전역 <head> 요소들 */}
      </head>
      <body>
        <AuthInitializer /> {/* 인증 상태 초기화 컴포넌트 */}
        <Header />
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            {children}
          </div>
        <Footer />
      </body>
    </html>
  )
}
