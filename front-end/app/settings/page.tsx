// app/page.tsx 또는 다른 클라이언트 컴포넌트
'use client';

import React, { useState } from 'react';
import FaceEmotionDetector from '@/components/FaceEmotionDetector'; // 위에서 만든 컴포넌트 임포트

export default function MyPage() {
  const [latestDetectedEmotion, setLatestDetectedEmotion] = useState<string | null>(null);
  const [latestEmotionScore, setLatestEmotionScore] = useState<number | null>(null);

  const handleEmotionDetectionResult = (emotion: string | null, score: number | null) => {
    setLatestDetectedEmotion(emotion);
    setLatestEmotionScore(score);
    console.log("최신 감지된 감정:", emotion, "점수:", score);
    // 여기에 감지된 감정을 EmotionSelection의 selectedEmotion으로 설정하는 로직 등을 추가할 수 있습니다.
    // 예를 들어: setSelectedEmotion(convertEmotionToId(emotion));
  };

  return (
    <div>
      <h1>나의 감정 분석 앱</h1>
      <FaceEmotionDetector onEmotionDetected={handleEmotionDetectionResult} />
      {latestDetectedEmotion && (
        <p className="mt-4 text-center">
          최근 감지된 감정: <strong>{latestDetectedEmotion}</strong> (확신도: {(latestEmotionScore! * 100).toFixed(2)}%)
        </p>
      )}
      {/* 다른 컴포넌트들 (EmotionSelection, RecommendationList 등) */}
    </div>
  );
}