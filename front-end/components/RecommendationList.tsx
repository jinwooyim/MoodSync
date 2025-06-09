// components/RecommendationList.tsx
'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, CheckSquare, Book} from "lucide-react";

import { useState } from "react";
// 타입 정의도 새로 만든 types 폴더에서 임포트합니다.
import { Emotion, RecommendationsMap, MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types";

// 부모 컴포넌트로부터 받을 props의 인터페이스 정의
interface RecommendationListProps {
  selectedEmotion: string;
  selectedEmotionData: Emotion; // Emotion 타입 사용
  musicRecommendations: RecommendationsMap<MusicRecommendation>; // RecommendationsMap 타입 사용
  activityRecommendations: RecommendationsMap<ActivityRecommendation>; // RecommendationsMap 타입 사용
  bookRecommendations: RecommendationsMap<BookRecommendation>; // 도서목록도 추가했습니다.
}

export default function RecommendationList({
  selectedEmotion,
  selectedEmotionData,
  musicRecommendations,
  activityRecommendations,
  bookRecommendations,
}: RecommendationListProps) {
  const [recommendationType, setRecommendationType] = useState<"music" | "activity" | "book">("music");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        {/* <Badge className={selectedEmotionData?.color}>선택된 감정: {selectedEmotionData?.name}</Badge> */}
      </div>

      <Tabs
        value={recommendationType}
        onValueChange={(value) => setRecommendationType(value as "music" | "activity" | "book")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            음악 추천
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            활동 추천
          </TabsTrigger>
          <TabsTrigger value="book" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            도서 추천
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicRecommendations[selectedEmotion]?.map((music, index) => (
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
            {activityRecommendations[selectedEmotion]?.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{activity.activity}</CardTitle> {/* 'activity'로 변경 */}
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookRecommendations[selectedEmotion]?.map((book, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{book.genre}</Badge>
                  {book.description && (
                    <p className="text-sm text-muted-foreground mt-2">{book.description}</p>
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
  );
}