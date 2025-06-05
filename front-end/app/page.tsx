// app/page.tsx (이전과 동일)
'use client';

import { useState } from "react";

import ImageSlider from '@/components/ImageSlider';
import EmotionSelection from "@/components/EmotionSelection";
import RecommendationList from "@/components/RecommendationList";
import EmotionSliderCard from "@/components/EmotionSliderCard"; // <-- 이 컴포넌트가 이제 내부에서 전환을 담당
import FaceEmotionDetector from '@/components/FaceEmotionDetector';
import { CustomMoodScores } from '@/types/emotion';
// 데이터 임포트 경로
import { emotions } from "@/data/emotions";
import { musicRecommendations } from "@/data/musicRecommendations";
import { activityRecommendations } from "@/data/activityRecommendations";

import { Input } from "@/components/ui/input"; // 헤더로 옮김 (일단 살렸음다)

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion);

  const [searchValue, setSearchValue] = useState<string>(""); // 헤더로 옮김 (일단 살렸음다)

  // 감정별 슬라이더 값 상태 (예: { happy: 50, sad: 30, ... })
  const [emotionSliderValues, setEmotionSliderValues] = useState<Record<string, number>>({});
  const [sliderControlledEmotion, setSliderControlledEmotion] = useState<string | null>(null);

  // 감정 분석 결과 상태
  const [latestDetectedMoods, setLatestDetectedMoods] = useState<CustomMoodScores | null>(null);

  // 슬라이더 값 변경 핸들러 (감정별로 값 저장)
  const handleSliderValueChange = (value: number, emotionId: string | null) => {
    if (emotionId) {
      setEmotionSliderValues((prev) => ({ ...prev, [emotionId]: value }));
      setSelectedEmotion(emotionId);
      setSliderControlledEmotion(emotionId);
    }
  };

  // 감정 분석 결과를 받아오면, 각 감정별 슬라이더 값에 반영
  const handleEmotionDetected = (moodScores: CustomMoodScores | null) => {
      setLatestDetectedMoods(moodScores);
      if (moodScores) {
        // CustomMoodScores의 key(한글)와 emotions의 id(영문) 매핑 필요
        const moodKeyToId: Record<string, string> = {
          행복: 'happy',
          슬픔: 'sad',
          스트레스: 'stressed',
          평온: 'calm',
          신남: 'excited',
          피곤함: 'tired',
        };
        const newSliderValues: Record<string, number> = { ...emotionSliderValues };
        Object.entries(moodScores).forEach(([moodKey, score]) => {
          const id = moodKeyToId[moodKey];
          if (id) newSliderValues[id] = Math.round(score); // 0~100 정수로 반영
        });
        setEmotionSliderValues(newSliderValues);
        // 가장 높은 감정 자동 선택
        const maxEntry = Object.entries(moodScores).reduce((max, cur) => cur[1] > max[1] ? cur : max, ["", 0]);
        if (moodKeyToId[maxEntry[0]]) {
          setSelectedEmotion(moodKeyToId[maxEntry[0]]);
          setSliderControlledEmotion(moodKeyToId[maxEntry[0]]);
        }
      }
  };

    const handleSendEmotion = async () => {

      const emotionKeys = ['happy', 'sad', 'stress', 'calm', 'excited', 'tired'] as const;
      type EmotionKey = typeof emotionKeys[number];

      const dummyEmotionData: Record<EmotionKey, number> = { // <== 이자리에 입력 값들이 들어가면 됩니다!!!! 팀원분들~~
        happy: 0.12,
        sad: 0.14,
        stress: 0.35,
        calm: 0.65,
        excited: 0.75,
        tired: 0.0
      };

      // // 필수 감정 값이 모두 있는지 확인
      const hasAllValues = emotionKeys.every(
        (key) => typeof dummyEmotionData[key] === 'number'
      );

      if (!hasAllValues) {
        alert("모든 감정의 값을 입력해주세요.");
        return;
      }
  
    try {
      const res = await fetch('/api/sendEmotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ value: valueArray }),
        body: JSON.stringify(dummyEmotionData),
      });

      const result = await res.json();
      console.log('🎯 추천 결과:', result);

      // TODO: 추천 결과를 상태로 저장해서 UI에 표시하거나, 다른 컴포넌트에 넘기기
    } catch (err) {
      console.error('추천 요청 실패:', err);
    }
  };

  // 현재 선택된 감정의 슬라이더 값 (없으면 50)
  const currentSliderValue = selectedEmotion ? (emotionSliderValues[selectedEmotion] ?? 50) : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      <div>
        <ImageSlider/>
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">지금 당신의 기분은 어떠신가요?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              현재 감정에 맞는 음악과 활동, 도서를 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
            </p>
          </div>

          {/* <div className="mb-8 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div> */}

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
            initialEmotionValue={currentSliderValue}
          />

          {/* FaceEmotionDetector 감정 분석 UI */}
          <FaceEmotionDetector onEmotionDetected={handleEmotionDetected} />

          {/* 입력된 감정들로 출력 결과 도출(버튼 클릭시) */}
          <div className="text-center mt-6">
          <button
            onClick={handleSendEmotion}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            감정 기반 추천 요청하기
          </button>
          </div>

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