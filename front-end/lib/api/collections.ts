// lib/api/collections.ts
import api from './base';
import type { Collection, CollectionItem } from '@/types/collection'; // CollectionItem도 import
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from '@/types'; 

export interface CreateCollectionParams {
  name: string;
  description?: string;
  isPublic: boolean;
}

export interface UpdateCollectionParams {
  collectionId: number;
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddToCollectionPayload {
  type: "music" | "activity" | "book";
  item: MusicRecommendation | ActivityRecommendation | BookRecommendation;
}

export interface CollectionItemDTO {
  collectionId: number;
  contentTitle: string;
  contentType: "music" | "activity" | "book";
  // addedAt, collectionItemId 등은 백엔드에서 생성하므로 클라이언트에서 보낼 필요 없음.
  // 만약 contentDetails를 JSON string으로 저장하고 싶다면 여기에 추가:
  // contentDetails?: string;
}

export async function createCollection(params: CreateCollectionParams) {
  const res = await api.post('/api/collections', params);
  return res.data;
}

export async function updateCollection(params: UpdateCollectionParams) {
  const { collectionId, ...rest } = params;
  const res = await api.put(`/api/collections/${collectionId}`, rest);
  return res.data;
}

export async function deleteCollection(collectionId: number) {
  const res = await api.delete(`/api/collections/${collectionId}`);
  return res.data;
}

export async function fetchCollections(): Promise<Collection[]> {
  const res = await api.get('/api/collections/user-collections');

  return res.data.map((dto: any) => ({
    id: String(dto.collectionId),
    userId: dto.userId,
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    items: dto.items ? dto.items.map((itemDto: any) => ({
      id: String(itemDto.collectionItemId),
      collectionId: String(itemDto.collectionId),
      contentTitle: itemDto.contentTitle,
      contentType: itemDto.contentType,
      addedAt: itemDto.addedAt,
    })) : [],
  }));
}

// 특정 컬렉션을 가져오는 함수
export async function fetchCollection(id: string): Promise<Collection> {
  const res = await api.get(`/api/collections/${id}`);
  const dto = res.data;
  return {
    id: String(dto.collectionId),
    userId: dto.userId,
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    items: dto.items ? dto.items.map((itemDto: any) => ({
        id: String(itemDto.collectionItemId),
        collectionId: String(itemDto.collectionId),
        contentTitle: itemDto.contentTitle, 
        contentType: itemDto.contentType,   
        addedAt: itemDto.addedAt,
    })) : [],
  };
}

// 메인화면 컬렉션에 아이템 추가
export async function addToCollection(payload: AddToCollectionPayload) {
  const res = await api.post('/api/collections/add-to-collection', payload); 
  return res.data;
}
export async function addCollectionItemToSelectedCollection(payload: CollectionItemDTO) {
  const res = await api.post('/api/collections/add-item', payload); // 백엔드의 `/api/collections/add-item` 엔드포인트 호출
  return res.data; // 백엔드에서 반환하는 성공 메시지 등을 받을 수 있습니다.
}