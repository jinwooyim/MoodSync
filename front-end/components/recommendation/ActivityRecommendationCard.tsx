// components/recommendation/ActivityRecommendationCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckSquare, Inbox } from "lucide-react";
import type { ActivityRecommendation } from "@/types";

interface ActivityRecommendationCardProps {
  activity: ActivityRecommendation;
  onAddToCollection: (item: ActivityRecommendation, type: "activity") => void;
}

export default function ActivityRecommendationCard({ activity, onAddToCollection }: ActivityRecommendationCardProps) {
  return (
    <Card className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {activity.activity}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          소요시간: {activity.duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge
          variant="secondary"
          className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
        >
          {activity.type}
        </Badge>
        <div className="flex space-x-2 mt-4">
          <Button className="w-full" variant="outline">
            <CheckSquare className="w-4 h-4 mr-2" />
            시작하기
          </Button>
          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(activity, "activity")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}