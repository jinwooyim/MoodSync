// components/recommendation/BookRecommendationCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, Inbox } from "lucide-react";
import type { BookRecommendation } from "@/types";

interface BookRecommendationCardProps {
  book: BookRecommendation;
  onAddToCollection: (item: BookRecommendation, type: "book") => void;
}

export default function BookRecommendationCard({ book, onAddToCollection }: BookRecommendationCardProps) {
  return (
    <Card className="hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {book.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge
          variant="secondary"
          className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300"
        >
          {book.genre}
        </Badge>
        {book.description && (
          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2 transition-colors duration-300">
            {book.description}
          </p>
        )}
        <div className="flex space-x-2 mt-4">
          <Button className="w-full" variant="outline">
            <Book className="w-4 h-4" />
            자세히
          </Button>
          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(book, "book")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}