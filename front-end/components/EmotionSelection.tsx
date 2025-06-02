// components/EmotionSelection.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { emotions } from "@/data/emotions"; // 경로 변경
import { LucideIcon } from "lucide-react"; // icon prop 타입을 위해 LucideIcon 임포트

interface EmotionSelectionProps {
  selectedEmotion: string | null;
  onSelectEmotion: (emotionId: string) => void;
}

export default function EmotionSelection({
  selectedEmotion,
  onSelectEmotion,
}: EmotionSelectionProps) {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {emotions.map((emotion) => (
          <Card
            key={emotion.id}
            className={`cursor-pointer text-center p-4 transition-all duration-200 ${
              selectedEmotion === emotion.id ? "ring-2 ring-purple-500 shadow-lg" : "hover:shadow-md"
            }`}
            onClick={() => onSelectEmotion(emotion.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-0">
              {emotion.icon && (
                <emotion.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              )}
              <h3 className="font-medium text-gray-900">
                {emotion.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {emotion.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}