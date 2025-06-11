import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types/index";

// 컬렉션 및 컬렉션 아이템 타입 정의
// 각 아이템에 id: string, type: 구분자만 추가하고, 나머지는 원본 타입 그대로 사용

export type CollectionItem =
  | (MusicRecommendation & { id: string; type: "music" })
  | (ActivityRecommendation & { id: string; type: "activity" })
  | (BookRecommendation & { id: string; type: "book" });

export type Collection = {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: CollectionItem[];
};
