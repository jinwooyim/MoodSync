"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Music, CheckSquare, Sparkles, Cloud, Sun, Zap, Smile } from "lucide-react"
import Link from 'next/link'

const emotions = [
  {
    id: "happy",
    name: "행복함",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    description: "기분이 좋고 즐거운 상태",
  },
  { id: "sad", name: "슬픔", icon: Cloud, color: "bg-blue-100 text-blue-800", description: "우울하고 침울한 기분" },
  {
    id: "stressed",
    name: "스트레스",
    icon: Zap,
    color: "bg-red-100 text-red-800",
    description: "긴장되고 압박감을 느끼는 상태",
  },
  { id: "calm", name: "평온함", icon: Sun, color: "bg-green-100 text-green-800", description: "차분하고 안정된 마음" },
  {
    id: "excited",
    name: "신남",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-800",
    description: "에너지가 넘치고 활기찬 상태",
  },
  {
    id: "tired",
    name: "피곤함",
    icon: Cloud,
    color: "bg-gray-100 text-gray-800",
    description: "지치고 휴식이 필요한 상태",
  },
]

const musicRecommendations = {
  happy: [
    { title: "Happy", artist: "Pharrell Williams", genre: "Pop" },
    { title: "Good as Hell", artist: "Lizzo", genre: "Pop" },
    { title: "Can't Stop the Feeling", artist: "Justin Timberlake", genre: "Pop" },
  ],
  sad: [
    { title: "Someone Like You", artist: "Adele", genre: "Ballad" },
    { title: "Mad World", artist: "Gary Jules", genre: "Alternative" },
    { title: "Hurt", artist: "Johnny Cash", genre: "Country" },
  ],
  stressed: [
    { title: "Weightless", artist: "Marconi Union", genre: "Ambient" },
    { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical" },
    { title: "Aqueous Transmission", artist: "Incubus", genre: "Alternative" },
  ],
  calm: [
    { title: "River", artist: "Joni Mitchell", genre: "Folk" },
    { title: "Mad About You", artist: "Sting", genre: "Jazz" },
    { title: "The Night We Met", artist: "Lord Huron", genre: "Indie Folk" },
  ],
  excited: [
    { title: "Uptown Funk", artist: "Bruno Mars", genre: "Funk" },
    { title: "I Gotta Feeling", artist: "Black Eyed Peas", genre: "Pop" },
    { title: "Pump It", artist: "Black Eyed Peas", genre: "Hip Hop" },
  ],
  tired: [
    { title: "Sleepyhead", artist: "Passion Pit", genre: "Indie Pop" },
    { title: "Dream a Little Dream", artist: "Ella Fitzgerald", genre: "Jazz" },
    { title: "Lullaby", artist: "Brahms", genre: "Classical" },
  ],
}

const activityRecommendations = {
  happy: [
    { activity: "친구들과 파티하기", duration: "2-3시간", type: "사회활동" },
    { activity: "새로운 취미 시작하기", duration: "1시간", type: "자기계발" },
    { activity: "야외 피크닉", duration: "3-4시간", type: "야외활동" },
  ],
  sad: [
    { activity: "일기 쓰기", duration: "30분", type: "자기성찰" },
    { activity: "따뜻한 차 마시며 독서", duration: "1-2시간", type: "휴식" },
    { activity: "감동적인 영화 보기", duration: "2시간", type: "엔터테인먼트" },
  ],
  stressed: [
    { activity: "명상하기", duration: "10-20분", type: "마음챙김" },
    { activity: "요가나 스트레칭", duration: "30분", type: "운동" },
    { activity: "자연 속 산책", duration: "1시간", type: "야외활동" },
  ],
  calm: [
    { activity: "그림 그리기", duration: "1시간", type: "창작활동" },
    { activity: "정원 가꾸기", duration: "1-2시간", type: "취미" },
    { activity: "클래식 음악 감상", duration: "30분", type: "문화활동" },
  ],
  excited: [
    { activity: "댄스 배우기", duration: "1시간", type: "운동" },
    { activity: "새로운 레시피 도전", duration: "2시간", type: "요리" },
    { activity: "모험적인 스포츠", duration: "2-3시간", type: "스포츠" },
  ],
  tired: [
    { activity: "따뜻한 목욕", duration: "30분", type: "휴식" },
    { activity: "가벼운 스트레칭", duration: "15분", type: "운동" },
    { activity: "편안한 음악과 함께 휴식", duration: "1시간", type: "휴식" },
  ],
}

export default function EmotionRecommendationApp() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [recommendationType, setRecommendationType] = useState<"music" | "activity">("music")

  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
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
              </Link >
              <Link href="/recommendations" className="text-gray-600 hover:text-gray-900 transition-colors">
                추천
              </Link >
              <Link href="/record" className="text-gray-600 hover:text-gray-900 transition-colors">
                내 기록
              </Link >
              <Link href="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
                설정
              </Link >
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">지금 당신의 기분은 어떠신가요?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            현재 감정에 맞는 음악과 활동을 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
          </p>
        </div>

        {/* Emotion Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">감정을 선택해주세요</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {emotions.map((emotion) => {
              const Icon = emotion.icon
              return (
                <Card
                  key={emotion.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedEmotion === emotion.id ? "ring-2 ring-purple-500 shadow-lg" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedEmotion(emotion.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <h4 className="font-medium text-gray-900">{emotion.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{emotion.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        {selectedEmotion && (
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <Badge className={selectedEmotionData?.color}>선택된 감정: {selectedEmotionData?.name}</Badge>
            </div>

            <Tabs
              value={recommendationType}
              onValueChange={(value) => setRecommendationType(value as "music" | "activity")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="music" className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  음악 추천
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  활동 추천
                </TabsTrigger>
              </TabsList>

              <TabsContent value="music" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {musicRecommendations[selectedEmotion as keyof typeof musicRecommendations]?.map((music, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{music.title}</CardTitle>
                        <CardDescription>{music.artist}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">{music.genre}</Badge>
                        <Button className="w-full mt-4" variant="outline">
                          <Music className="w-4 h-4 mr-2" />
                          듣기
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activityRecommendations[selectedEmotion as keyof typeof activityRecommendations]?.map(
                    (activity, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{activity.activity}</CardTitle>
                          <CardDescription>소요시간: {activity.duration}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary">{activity.type}</Badge>
                          <Button className="w-full mt-4" variant="outline">
                            <CheckSquare className="w-4 h-4 mr-2" />
                            시작하기
                          </Button>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Call to Action */}
        {!selectedEmotion && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold mb-2">맞춤형 추천을 받아보세요</h3>
                <p className="text-gray-600 mb-4">
                  위에서 현재 감정을 선택하시면 그에 맞는 음악과 활동을 추천해드립니다.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="font-bold text-lg">MoodSync</span>
              </div>
              <p className="text-gray-600 text-sm">감정에 맞는 음악과 활동을 추천하여 더 나은 하루를 만들어갑니다.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    음악 추천
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    활동 추천
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    감정 기록
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    피드백
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    회사소개
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 MoodSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
