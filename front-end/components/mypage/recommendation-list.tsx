import { Book, Music, Activity, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { YoutubeVideo, MusicExceptEmotionDTO } from "@/lib/mypage/mypage-types"

interface RecommendationListProps {
  title: string
  items: string[]
  type: "music" | "book" | "activity"
  youtubeResults?: YoutubeVideo[]
  musicData?: MusicExceptEmotionDTO[]
}

export function RecommendationList({ title, items, type, youtubeResults, musicData }: RecommendationListProps) {
  const getIcon = () => {
    switch (type) {
      case "music":
        return <Music className="h-5 w-5" />
      case "book":
        return <Book className="h-5 w-5" />
      case "activity":
        return <Activity className="h-5 w-5" />
      default:
        return null
    }
  }

  const findYoutubeVideo = (musicName: string) => {
    if (!youtubeResults) return null

    return youtubeResults.find((video) => {
      return (
        video.title.toLowerCase().includes(musicName.toLowerCase()) ||
        (video.channel && video.channel.toLowerCase().includes(musicName.toLowerCase()))
      )
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "music" && musicData ? (
            musicData.map((music, index) => {
              const video = findYoutubeVideo(music.musicName)

              return (
                <div key={music.musicNumber} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground">{index + 1}.</span>
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
                      className="flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded"
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
            })
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
