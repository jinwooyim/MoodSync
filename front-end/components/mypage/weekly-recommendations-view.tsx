"use client"

// import { useEffect, useState } from "react"
// import { getLatestRecords, type UserRecord } from "@/lib/mypage/mypage-types"
import { type UserRecord } from "@/lib/mypage/mypage-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Activity, Book, Calendar, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface WeeklyRecommendationsViewProps {
  allRecords: UserRecord[]
}

export function WeeklyRecommendationsView({ allRecords }: WeeklyRecommendationsViewProps) {
  if (allRecords.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">주간 추천 데이터가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 음악 추천 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-blue-600" />
              주간 음악 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allRecords.map((record) => (
              <div key={record.id} className="border-l-2 border-blue-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
                  </span>
                </div>
                <div className="space-y-2">
                  {record.recommendedMusics?.slice(0, 2).map((music) => {
                    const video = record.youtubeSearchResults?.find((video) => {
                      return (
                        video.title.toLowerCase().includes(music.musicName.toLowerCase()) ||
                        (video.channel && video.channel.toLowerCase().includes(music.musicName.toLowerCase()))
                      )
                    })

                    return (
                      <div key={music.musicNumber} className="space-y-1">
                        <div className="text-sm">
                          🎵 {music.musicName} - {music.musicAuthor}
                        </div>
                        {video && (
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3 w-3" />
                            YouTube에서 듣기
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 활동 추천 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              주간 활동 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allRecords.map((record) => (
              <div key={record.id} className="border-l-2 border-green-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
                  </span>
                </div>
                <ul className="space-y-1">
                  {record.recommendedActions?.slice(0, 2).map((action) => (
                    <li key={action.actingNumber} className="text-sm text-muted-foreground">
                      🧘 {action.actingName}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 도서 추천 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-600" />
              주간 도서 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allRecords.map((record) => (
              <div key={record.id} className="border-l-2 border-purple-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
                  </span>
                </div>
                <ul className="space-y-1">
                  {record.recommendedBooks?.slice(0, 2).map((book) => (
                    <li key={book.bookNumber} className="text-sm text-muted-foreground">
                      📖 {book.bookName} - {book.bookAuthor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// export function WeeklyRecommendationsView() {
//   const [records, setRecords] = useState<UserRecord[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true)
//       try {
//         const latestRecords = await getLatestRecords()
//         setRecords(latestRecords)
//       } catch (error) {
//         console.error("주간 추천 데이터 로딩 실패:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

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

//   if (records.length === 0) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <p className="text-lg text-muted-foreground">주간 추천 데이터가 없습니다.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* 음악 추천 */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Music className="h-5 w-5 text-blue-600" />
//               주간 음악 추천
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {records.map((record) => (
//               <div key={record.id} className="border-l-2 border-blue-200 pl-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">
//                     {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
//                   </span>
//                 </div>
//                 <div className="space-y-2">
//                   {record.recommendedMusics?.slice(0, 2).map((music) => {
//                     const video = record.youtubeSearchResults?.find((video) => {
//                       return (
//                         video.title.toLowerCase().includes(music.musicName.toLowerCase()) ||
//                         (video.channel && video.channel.toLowerCase().includes(music.musicName.toLowerCase()))
//                       )
//                     })

//                     return (
//                       <div key={music.musicNumber} className="space-y-1">
//                         <div className="text-sm">
//                           🎵 {music.musicName} - {music.musicAuthor}
//                         </div>
//                         {video && (
//                           <a
//                             href={video.videoUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800"
//                           >
//                             <ExternalLink className="h-3 w-3" />
//                             YouTube에서 듣기
//                           </a>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* 활동 추천 */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Activity className="h-5 w-5 text-green-600" />
//               주간 활동 추천
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {records.map((record) => (
//               <div key={record.id} className="border-l-2 border-green-200 pl-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">
//                     {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
//                   </span>
//                 </div>
//                 <ul className="space-y-1">
//                   {record.recommendedActions?.slice(0, 2).map((action) => (
//                     <li key={action.actingNumber} className="text-sm text-muted-foreground">
//                       🧘 {action.actingName}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* 도서 추천 */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Book className="h-5 w-5 text-purple-600" />
//               주간 도서 추천
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {records.map((record) => (
//               <div key={record.id} className="border-l-2 border-purple-200 pl-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span className="text-sm font-medium">
//                     {format(new Date(record.created_at), "MM월 dd일", { locale: ko })}
//                   </span>
//                 </div>
//                 <ul className="space-y-1">
//                   {record.recommendedBooks?.slice(0, 2).map((book) => (
//                     <li key={book.bookNumber} className="text-sm text-muted-foreground">
//                       📖 {book.bookName} - {book.bookAuthor}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
