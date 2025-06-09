// app/page.tsx
'use client';

import { useState, useEffect, useRef } from "react";

import ImageSlider from '@/components/ImageSlider';
import EmotionSelection from "@/components/EmotionSelection";
import RecommendationList from "@/components/RecommendationList";
import EmotionSliderCard from "@/components/EmotionSliderCard";
import EmotionValuesDisplay from "@/components/EmotionValuesDisplay"; // EmotionValuesDisplay는 현재 사용되지 않는 것 같지만, 코드에 있으니 유지합니다.
import FaceEmotionDetector from '@/components/FaceEmotionDetector';
import { CustomMoodScores } from '@/types/emotion';
import { RecommendationResult } from "@/types/index";

// 데이터 임포트 경로
import { emotions } from "@/data/emotions";
import { musicRecommendations } from "@/data/musicRecommendations"; // 현재 사용되지 않음
import { activityRecommendations } from "@/data/activityRecommendations"; // 현재 사용되지 않음

import { Input } from "@/components/ui/input"; // 현재 사용되지 않음

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion);
  // emotionValues는 EmotionValuesDisplay에서만 사용될 것으로 보이며, 슬라이더 값과는 별개입니다.
  const [emotionValues, setEmotionValues] = useState<Record<string, number>>({
    happy: 0, sad: 0, stress: 0, calm: 0, excited: 0, tired: 0
  });
  const [searchValue, setSearchValue] = useState<string>(""); // 현재 사용되지 않음

  // 감정별 슬라이더 값 상태 (예: { happy: 50, sad: 30, ... })
  const [emotionSliderValues, setEmotionSliderValues] = useState<Record<string, number>>({});
  const [sliderControlledEmotion, setSliderControlledEmotion] = useState<string | null>(null);

  // 감정 분석 결과 상태
  const [latestDetectedMoods, setLatestDetectedMoods] = useState<CustomMoodScores | null>(null);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResult | null>(null);

  // --- 팝업 관련 상태 및 Ref 추가 ---
  const emotionSelectionRef = useRef<HTMLDivElement>(null);
  const [showFloatingEmotionSelection, setShowFloatingEmotionSelection] = useState(false);

  useEffect(() => {
    if (!emotionSelectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting이 false면 (뷰포트 밖으로 나갔으면) 팝업을 보여줍니다.
        // 하지만 'right' 팝업은 스크롤 다운 시에만 나타나게 하는 것이 일반적이므로
        // boundingClientRect.top을 확인하여 스크롤 업/다운 방향을 감지할 수 있습니다.
        setShowFloatingEmotionSelection(!entry.isIntersecting);
      },
      {
        root: null, // 뷰포트
        rootMargin: '0px', // 요소가 뷰포트 밖으로 완전히 나갔을 때
        threshold: 0.1 // 요소가 뷰포트의 10% 이상 보이지 않을 때
      }
    );

    observer.observe(emotionSelectionRef.current);

    return () => {
      if (emotionSelectionRef.current) {
        observer.unobserve(emotionSelectionRef.current);
      }
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행
  // --- 팝업 관련 상태 및 Ref 추가 끝 ---


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

  // 감정 선택 버튼 클릭 시 호출될 핸들러
  const handleEmotionSelectClick = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    setSliderControlledEmotion(null); // 슬라이더 제어 감정 초기화 (선택 버튼 클릭 시)

    // 해당 감정의 슬라이더 값이 없거나 0일 경우 50으로 초기화
    setEmotionSliderValues((prev) => {
      const currentVal = prev[emotionId];
      if (currentVal === undefined || currentVal === 0) {
        return { ...prev, [emotionId]: 50 }; // 50으로 설정
      }
      return prev; // 그 외의 경우는 기존 값 유지
    });
  };

  const handleSendEmotion = async () => {
    const emotionKeys = ['happy', 'sad', 'stress', 'calm', 'excited', 'tired'] as const;
    type EmotionKey = typeof emotionKeys[number];

      const normalizedEmotionData: Record<EmotionKey, number> = Object.fromEntries(
        emotionKeys.map((key) => [key, emotionValues[key] / 100])
      ) as Record<EmotionKey, number>;

      console.log("@# normalizedEmotionData =>", normalizedEmotionData);

    try {
      const res = await fetch('/api/sendEmotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedEmotionData),
      });

      const result = await res.json();
      console.log('🎯 추천 결과:', result);

      const emotion = selectedEmotion ?? "happy";

      setRecommendationResult({
        musicRecommendations: {
          [emotion]: result.music_dtos.map((m: any) => ({
            title: m.musicName,
            artist: m.musicAuthor,
            genre: "알 수 없음",
          })),
        },
        activityRecommendations: {
          [emotion]: result.act_dtos.map((a: any) => ({
            activity: a.actingName,
            type: "일상",
            duration: "30분",
          })),
        },
        bookRecommendations: {
          [emotion]: result.book_dtos.map((b: any) => ({
            title: b.bookName,
            author: b.bookAuthor,
            genre: b.bookGenre ?? "미정",
            description: b.bookDescription ?? "",
          })),
        },
      });
    } catch (err) {
      console.error('추천 요청 실패:', err);
      alert("추천 정보를 불러오지 못했습니다. 다시 시도해주세요.");
    }
  };

  // 현재 선택된 감정의 슬라이더 값 (없으면 50)
  const currentSliderValue = selectedEmotion ? (emotionSliderValues[selectedEmotion] ?? 50) : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      <div>
        <ImageSlider />
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">지금 당신의 기분은 어떠신가요?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              현재 감정에 맞는 음악과 활동, 도서를 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
            </p>
          </div>
          <div ref={emotionSelectionRef}>
            <EmotionSelection
              selectedEmotion={selectedEmotion}
              onSelectEmotion={handleEmotionSelectClick} // 새로 정의한 핸들러 연결
              emotionValues={emotionSliderValues} // emotionSliderValues를 여기에 전달
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 w-full">
            {/* 왼쪽: Face 감정 분석 */}
            <div className="flex flex-col justify-between space-y-6 w-full">
              <div className="w-full p-6 bg-white rounded-2xl hover:shadow-lg transition-shadow duration-200 shadow-md ">
                <FaceEmotionDetector onEmotionDetected={handleEmotionDetected} />
              </div>
            </div>

            {/* 오른쪽: 슬라이더 + 감정값 */}
            <div className="flex flex-col justify-between space-y-6 w-full">
              <div className="w-full p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 ">
                <EmotionSliderCard
                  selectedEmotionData={selectedEmotionData}
                  onEmotionValueChange={handleSliderValueChange}
                  initialEmotionValue={currentSliderValue}
                />
              </div>
            </div>
          </div>

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
          {selectedEmotion && selectedEmotionData && recommendationResult && (
            <RecommendationList
              selectedEmotion={selectedEmotion}
              selectedEmotionData={selectedEmotionData}
              musicRecommendations={recommendationResult.musicRecommendations}
              activityRecommendations={recommendationResult.activityRecommendations}
              bookRecommendations={recommendationResult.bookRecommendations}
            />
          )}
        </main>
      </div>
      {/* --- 플로팅 팝업 EmotionSelection UI --- */}
{showFloatingEmotionSelection && (
  <div
    className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white rounded-lg shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto
               opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    // pointer-events-none: 이 요소 자체는 클릭 이벤트를 받지 않고 아래로 전달합니다.
  >
    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center pointer-events-auto">
      {/* 팝업 내부의 텍스트도 클릭 불가 상태가 될 수 있으므로, 다시 클릭 가능하게 설정 */}
      현재 감정 선택
    </h4>
    <div className="flex flex-col gap-2 pointer-events-auto">
      {/* 팝업 내부의 클릭 가능한 요소(감정 카드)는 다시 클릭 가능하게 설정 */}
      {emotions.map((emotion) => (
        <div
          key={`floating-${emotion.id}`}
          className={`flex items-center p-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-gray-50
          `}
        >
          {emotion.icon && (
            <emotion.icon className="w-6 h-6 mr-2 text-gray-600" />
          )}
          <span className="font-medium text-gray-800 flex-grow">{emotion.name}</span>
          {emotionSliderValues[emotion.id] !== undefined && emotionSliderValues[emotion.id] > 0 && (
            <span className="text-sm font-bold text-indigo-600 ml-auto">
              {emotionSliderValues[emotion.id]}%
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)}
{/* --- 플로팅 팝업 EmotionSelection UI 끝 --- */}
    </div>
  );
}