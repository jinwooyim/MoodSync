"use client"

import { useState } from "react"
import { DateSelector } from "@/components/mypage/date-selector"
import { EmotionChart } from "@/components/mypage/emotion-chart"
import { RecommendationList } from "@/components/mypage/recommendation-list"
import { mockUserData } from "@/lib/mypage/mock-data"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Find data for the selected date or use the first entry if not found
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
  const userData = mockUserData.find((d) => d.date === selectedDateStr) || mockUserData[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">감정 대시보드</h1>

      <div className="mb-8">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={mockUserData.map((d) => new Date(d.date))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}의 감정 상태
            </h2>
            <EmotionChart emotions={userData.emotions} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RecommendationList title="추천 음악" items={userData.recommendations.music} type="music" />
            <RecommendationList title="추천 활동" items={userData.recommendations.activities} type="activity" />
            <RecommendationList title="추천 도서" items={userData.recommendations.books} type="book" />
          </div>
        </div>
      </div>
    </div>
  )
}
