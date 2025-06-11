"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, CheckSquare, Book } from "lucide-react"

import { useState } from "react"
// 타입 정의 및 emotions 데이터 임포트 (Badge 출력을 위해 emotionUsedForDisplay는 여전히 필요합니다.)
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types"
import { emotions } from "@/data/emotions"

// 부모 컴포넌트로부터 받을 props의 인터페이스 정의
interface RecommendationListProps {
  // musicRecommendations, activityRecommendations, bookRecommendations는 이제 Emotion ID를 키로 가지지 않고,
  // 해당 감정의 추천 목록 배열 자체를 직접 받습니다.
  musicRecommendations: MusicRecommendation[] // ✨ 변경됨
  activityRecommendations: ActivityRecommendation[] // ✨ 변경됨
  bookRecommendations: BookRecommendation[] // ✨ 변경됨
  recommendationEmotionId: string | null // 이 추천 결과가 어떤 감정을 기반으로 했는지 알려주는 ID
  recommendationDirty?: boolean // 감정 값 변경 여부 prop 추가
}

export default function RecommendationList({
  musicRecommendations,
  activityRecommendations,
  bookRecommendations,
  recommendationEmotionId,
  recommendationDirty = false, // 기본값 false
}: RecommendationListProps) {
  const [recommendationType, setRecommendationType] = useState<"music" | "activity" | "book">("music")

  // recommendationEmotionId를 사용하여 해당 감정의 전체 데이터를 emotions 배열에서 찾습니다.
  // 이 부분은 배지(Badge) 출력을 위해 여전히 필요합니다.
  const emotionUsedForDisplay = emotions.find((e) => e.id === recommendationEmotionId)

  // 만약 유효한 recommendationEmotionId에 해당하는 감정 데이터를 찾지 못했다면 렌더링하지 않습니다.
  if (!emotionUsedForDisplay) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="mb-8"></div>
        {recommendationDirty ? (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 transition-colors duration-300">
            감정 값이 변경되었습니다! 다시 감정 분석을 해주세요!
          </Badge>
        ) : (
          <Badge
            className={`${emotionUsedForDisplay.color} transition-colors duration-300 dark:bg-gray-600 dark:text-gray-200`}
          >
            추천 기준 감정: {emotionUsedForDisplay.name}
          </Badge>
        )}
      </div>

      <Tabs
        value={recommendationType}
        onValueChange={(value) => setRecommendationType(value as "music" | "activity" | "book")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-muted dark:bg-gray-700 transition-colors duration-300">
          <TabsTrigger
            value="music"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Music className="w-4 h-4" />
            음악 추천
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <CheckSquare className="w-4 h-4" />
            활동 추천
          </TabsTrigger>
          <TabsTrigger
            value="book"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Book className="w-4 h-4" />
            도서 추천
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ✨ musicRecommendations를 직접 순회합니다. */}
            {musicRecommendations.map((music, index) => (
              <Card
                key={index}
                className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {music.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {music.artist}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="secondary"
                    className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
                  >
                    {music.genre}
                  </Badge>
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
            {/* ✨ activityRecommendations를 직접 순회합니다. */}
            {activityRecommendations.map((activity, index) => (
              <Card
                key={index}
                className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {activity.activity}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    소요시간: {activity.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="secondary"
                    className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
                  >
                    {activity.type}
                  </Badge>
                  <Button className="w-full mt-4" variant="outline">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    시작하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ✨ bookRecommendations를 직접 순회합니다. */}
            {bookRecommendations.map((book, index) => (
              <Card
                key={index}
                className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {book.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="secondary"
                    className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
                  >
                    {book.genre}
                  </Badge>
                  {book.description && (
                    <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2 transition-colors duration-300">
                      {book.description}
                    </p>
                  )}
                  <Button className="w-full mt-4" variant="outline">
                    <Book className="w-4 h-4" />
                    자세히
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
