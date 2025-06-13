// components/recommendation/MusicRecommendationCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Inbox } from "lucide-react";
import type { MusicRecommendation } from "@/types";

interface MusicRecommendationCardProps {
  music: MusicRecommendation;
  onAddToCollection: (item: MusicRecommendation, type: "music") => void;
  videoUrl?: string; // 새로 추가
}

export default function MusicRecommendationCard({ music, onAddToCollection, videoUrl }: MusicRecommendationCardProps) {
  return (
    <Card className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {music.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {music.artist}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge
          variant="secondary"
          className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
        >
          {music.genre}
        </Badge>
        <div className="flex space-x-2 mt-4">
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <Music className="w-4 h-4 mr-2" />
              듣기
            </a>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              <Music className="w-4 h-4 mr-2" />
              듣기 불가
            </Button>
          )}

          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(music, "music")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}