// types/collection.d.ts

export interface CollectionItem {
  id: string; // 백엔드의 collectionItemId에 해당
  collectionId: string; // 백엔드의 collectionId에 해당
  contentTitle: string; // ★ 새롭게 추가된 필드
  contentType: string; // 기존에 있던 필드 유지
  addedAt: string;
}

export interface Collection {
  id: string; // 백엔드의 collectionId에 해당
  userId?: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  items: CollectionItem[];
}

