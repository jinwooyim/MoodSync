"use client"

import { useState  } from "react"
import { DateSelector } from "@/components/mypage/date-selector"
import { EmotionRadarChart } from "@/components/mypage/emotion-radar-chart"
import { RecommendationCards } from "@/components/mypage/recommendation-cards"
import { type UserRecord } from "@/lib/mypage/mypage-types"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface DailyEmotionViewProps {
  currentRecord: UserRecord | null
  allRecords: UserRecord[]
}

export function DailyEmotionView({
  currentRecord,
  allRecords,
}: DailyEmotionViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // 선택된 날짜에 해당하는 레코드 찾기
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
  const selectedRecord =
    allRecords.find((record) => {
      const recordDate = format(new Date(record.created_at), "yyyy-MM-dd")
      return recordDate === selectedDateStr
    }) || currentRecord

  if (!selectedRecord) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">데이터를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const availableDates = allRecords.map((record) => new Date(record.created_at))

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-xs">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          availableDates={availableDates}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}의 감정 상태
            </h2>
            <EmotionRadarChart record={selectedRecord} />
          </div>
        </div>

        <div className="space-y-6">
          <RecommendationCards record={selectedRecord} />
        </div>
      </div>
    </div>
  )
}

// export function DailyEmotionView() {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
//   const [currentRecord, setCurrentRecord] = useState<UserRecord | null>(null)
//   const [allRecords, setAllRecords] = useState<UserRecord[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true)
//       try {
//         const [current, latest] = await Promise.all([getUserRecord(), getLatestRecords()])
//         setCurrentRecord(current)
//         setAllRecords(latest)
//       } catch (error) {
//         console.error("데이터 로딩 실패:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // 선택된 날짜에 해당하는 레코드 찾기
//   const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
//   const selectedRecord =
//     allRecords.find((record) => {
//       const recordDate = format(new Date(record.created_at), "yyyy-MM-dd")
//       return recordDate === selectedDateStr
//     }) || currentRecord

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>데이터를 불러오는 중...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!selectedRecord) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <p className="text-lg text-muted-foreground">데이터를 찾을 수 없습니다.</p>
//         </div>
//       </div>
//     )
//   }

//   const availableDates = allRecords.map((record) => new Date(record.created_at))

//   return (
//     <div className="p-6 space-y-6">
//       <div className="max-w-xs">
//         <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} availableDates={availableDates} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="space-y-6">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">
//               {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}의 감정 상태
//             </h2>
//             <EmotionRadarChart record={selectedRecord} />
//           </div>
//         </div>

//         <div className="space-y-6">
//           <RecommendationCards record={selectedRecord} />
//         </div>
//       </div>
//     </div>
//   )
// }
