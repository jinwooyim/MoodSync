import { Music, Activity, Book, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserRecord } from "@/lib/mypage/mypage-types"

interface RecommendationCardsProps {
  record: UserRecord
}

export function RecommendationCards({ record }: RecommendationCardsProps) {
  const findYoutubeVideo = (musicName: string) => {
    if (!record.youtubeSearchResults) return null

    return record.youtubeSearchResults.find((video) => {
      return (
        video.title.toLowerCase().includes(musicName.toLowerCase()) ||
        (video.channel && video.channel.toLowerCase().includes(musicName.toLowerCase()))
      )
    })
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* 음악 추천 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Music className="h-5 w-5 text-blue-600" />
            추천 음악
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {record.recommendedMusics?.map((music) => {
            const video = findYoutubeVideo(music.musicName)

            return (
              <div key={music.musicNumber} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-medium">{music.musicName}</div>
                    <div className="text-sm text-muted-foreground">{music.musicAuthor}</div>
                  </div>
                </div>

                {video && (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-20 h-15 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{video.title}</div>
                      <div className="text-xs text-muted-foreground truncate">채널: {video.channel}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 활동 추천 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            추천 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {record.recommendedActions?.map((action, index) => (
              <li key={action.actingNumber} className="flex items-start gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <span>{action.actingName}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 도서 추천 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Book className="h-5 w-5 text-purple-600" />
            추천 도서
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {record.recommendedBooks?.map((book, index) => (
              <li key={book.bookNumber} className="flex items-start gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <div>
                  <div className="font-medium">{book.bookName}</div>
                  <div className="text-sm text-muted-foreground">{book.bookAuthor}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
