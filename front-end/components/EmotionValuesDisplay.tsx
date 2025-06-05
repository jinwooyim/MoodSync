// components/EmotionValuesDisplay.tsx
import { Emotion } from "@/types";
import { useEffect } from "react";

interface EmotionValuesDisplayProps {
  emotions: Emotion[];
  emotionValues: Record<string, number>; // emotionSliderValues 와 동일
  onValuesChange?: (values: Record<string, number>) => void;
}

export default function EmotionValuesDisplay({
  emotions,
  emotionValues,
  onValuesChange
}: EmotionValuesDisplayProps) {

  useEffect(() => {
    if (onValuesChange) {
      onValuesChange(emotionValues);
    }
  }, [emotionValues, onValuesChange]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 max-w-xl mx-auto">
      {emotions.map((emotion) => (
        <div key={emotion.id} className="flex flex-col items-center bg-white p-4 rounded-xl shadow">
          <emotion.icon className={`w-6 h-6 mb-2 ${emotion.color}`} />
          <span className="text-md font-semibold">{emotion.name}</span>
          <span className="text-lg font-bold text-indigo-600">
            {emotionValues[emotion.id] ?? 0}%
          </span>
        </div>
      ))}
    </div>
  );
}
