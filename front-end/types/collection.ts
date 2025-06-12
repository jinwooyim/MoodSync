// types/collection.d.ts

export interface CollectionItem {
  collectionItemId: number; //★ string -> number로 변경
  collectionId: string; // 백엔드의 collectionId에 해당
  contentTitle: string; // ★ 새롭게 추가된 필드
  contentType: string; // 기존에 있던 필드 유지
  addedAt: string;
  itemOrder: number;
}

export interface Collection {
  collectionId: string;
  userId?: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  items: CollectionItem[];
  userName?: string;
}
