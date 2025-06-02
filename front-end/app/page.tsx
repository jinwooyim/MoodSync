// app/page.tsx
'use client';

import { useState } from "react";
import { Sparkles } from "lucide-react";

import EmotionSelection from "@/components/EmotionSelection";
import RecommendationList from "@/components/RecommendationList";
import { Card, CardContent } from "@/components/ui/card";

// 데이터 임포트 경로 변경
import { emotions } from "@/data/emotions"; // 감정 데이터
import { musicRecommendations } from "@/data/musicRecommendations"; // 음악 추천 데이터
import { activityRecommendations } from "@/data/activityRecommendations"; // 활동 추천 데이터

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">지금 당신의 기분은 어떠신가요?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          현재 감정에 맞는 음악과 활동을 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
        </p>
      </div>

      <EmotionSelection
        selectedEmotion={selectedEmotion}
        onSelectEmotion={setSelectedEmotion}
      />

      {/* Recommendations */}
      {selectedEmotion && selectedEmotionData && (
        <RecommendationList
          selectedEmotion={selectedEmotion}
          selectedEmotionData={selectedEmotionData}
          musicRecommendations={musicRecommendations}
          activityRecommendations={activityRecommendations}
        />
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
    </div>
  );
}