import type { Metadata } from 'next'
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
      <body>
        <Header />
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            {children}
          </div>
        <Footer />
      </body>
    </html>
  )
}
