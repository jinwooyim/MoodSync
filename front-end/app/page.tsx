// app/page.tsx (이전과 동일)
'use client';

import { useState } from "react";

import EmotionSelection from "@/components/EmotionSelection";
import RecommendationList from "@/components/RecommendationList";
import EmotionSliderCard from "@/components/EmotionSliderCard"; // <-- 이 컴포넌트가 이제 내부에서 전환을 담당
import FaceEmotionDetector from '@/components/FaceEmotionDetector';
import { CustomMoodScores } from '@/types/emotion';

// 데이터 임포트 경로
import { emotions } from "@/data/emotions";
import { musicRecommendations } from "@/data/musicRecommendations";
import { activityRecommendations } from "@/data/activityRecommendations";

import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion);

  const [searchValue, setSearchValue] = useState<string>("");
  const [emotionSliderValue, setEmotionSliderValue] = useState<number>(50); // 슬라이더 값 상태
  const [sliderControlledEmotion, setSliderControlledEmotion] = useState<string | null>(null);

  // 감정 분석 결과 상태 추가
  const [latestDetectedMoods, setLatestDetectedMoods] = useState<CustomMoodScores | null>(null);

  const handleSliderValueChange = (value: number, emotionId: string | null) => {
    setEmotionSliderValue(value);
    if (emotionId) {
      setSelectedEmotion(emotionId);
      setSliderControlledEmotion(emotionId);
    } else {
      // 감정 선택이 없으면 슬라이더는 비활성화되므로 이 분기는 거의 실행되지 않음
    }
  };

  // FaceEmotionDetector에서 감정 분석 결과를 받아오는 핸들러
  const handleEmotionDetected = (moodScores: CustomMoodScores | null) => {
    setLatestDetectedMoods(moodScores);
    console.log('최신 감지된 감정:', moodScores);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      <div>
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">지금 당신의 기분은 어떠신가요?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              현재 감정에 맞는 음악과 활동을 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
            </p>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <EmotionSelection
            selectedEmotion={selectedEmotion}
            onSelectEmotion={(emotionId) => {
              setSelectedEmotion(emotionId);
              setSliderControlledEmotion(null); // 감정 선택 시 슬라이더 제어 해제 (필요시)
            }}
          />

          {/* EmotionSliderCard를 항상 렌더링하며, 내부에서 UI 전환을 처리합니다. */}
          <EmotionSliderCard
            selectedEmotionData={selectedEmotionData}
            onEmotionValueChange={handleSliderValueChange}
            initialEmotionValue={emotionSliderValue}
          />

          {/* FaceEmotionDetector 감정 분석 UI */}
          <FaceEmotionDetector onEmotionDetected={handleEmotionDetected} />


          {/* Recommendations */}
          {selectedEmotion && selectedEmotionData && (
            <RecommendationList
              selectedEmotion={selectedEmotion}
              selectedEmotionData={selectedEmotionData}
              musicRecommendations={musicRecommendations}
              activityRecommendations={activityRecommendations}
            />
          )}
        </main>
      </div>
    </div>
  );
}