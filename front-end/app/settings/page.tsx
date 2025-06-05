// app/settings/page.tsx
'use client'; // 이 페이지가 클라이언트 컴포넌트임을 명시

import { useState } from 'react';
import FaceEmotionDetector from '@/components/FaceEmotionDetector';
import { CustomMoodScores } from '@/types/emotion'; // CustomMoodScores 타입을 임포트해야 합니다.

export default function MyPage() {
  const [latestDetectedMoods, setLatestDetectedMoods] = useState<CustomMoodScores | null>(null);

  const handleEmotionDetected = (moodScores: CustomMoodScores | null) => {
    setLatestDetectedMoods(moodScores);
    // 이 console.log도 수정합니다.
    console.log('최신 감지된 감정:', moodScores);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">내 감정 분석</h1>

      {/* FaceEmotionDetector 컴포넌트 */}
      <FaceEmotionDetector onEmotionDetected={handleEmotionDetected} />

      {/* ⭐️ 이 부분이 중요합니다: latestDetectedMoods 객체를 직접 렌더링하지 않고 순회하여 표시합니다. */}
      {latestDetectedMoods && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">최신 감지된 감정 결과</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(latestDetectedMoods).map(([mood, score]) => (
              <div key={mood} className="flex justify-between items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                <span className="font-medium text-blue-800">{mood}: </span>
                <span className="text-lg font-semibold text-blue-900">{(score).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          {/* 필요하다면 여기에 추가적인 메시지나 컴포넌트를 렌더링할 수 있습니다. */}
        </div>
      )}
    </div>
  );
}