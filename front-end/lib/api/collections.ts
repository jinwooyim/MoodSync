// lib/api/collections.ts
import api from './base';
// 이미 타입 정의되어 있는 것들:
import type { Collection, CollectionItem } from '@/types/collection'; 
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from '@/types'; 

// --- 기존 인터페이스 유지 및 업데이트 ---

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

// ⭐ CollectionItemDTO 타입 업데이트: itemOrder와 contentId 추가, collectionItemId는 옵셔널 ⭐
export interface CollectionItemDTO {
  collectionItemId?: number; // 생성 시에는 백엔드에서 할당, 수정/삭제 시에는 필요
  contentTitle: string;
  contentType: "music" | "activity" | "book";
  itemOrder?: number; // 아이템의 순서
  contentId?: string; // 원본 추천 아이템의 ID (음악 ID, 활동 ID, 책 ID 등)
  collectionId?: number; // 이 DTO가 어떤 컬렉션에 속하는지 명시 (선택 사항이지만 명확성을 위해)
}

// --- 기존 API 함수 유지 ---

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
    collectionId: String(dto.collectionId),
    userId: dto.userId,
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    items: dto.items ? dto.items.map((itemDto: any) => ({
      collectionItemId: itemDto.collectionItemId,
      collectionId: String(itemDto.collectionId),
      contentTitle: itemDto.contentTitle,
      contentType: itemDto.contentType,
      addedAt: itemDto.addedAt,
      itemOrder: itemDto.itemOrder, 
      contentId: itemDto.contentId,
    })) : [],
  }));
}

export async function fetchCollection(id: string): Promise<Collection> {
  const res = await api.get(`/api/collections/${id}`);
  const dto = res.data;
  return {
    collectionId: String(dto.collectionId),
    userId: dto.userId,
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    items: dto.items ? dto.items.map((itemDto: any) => ({
      collectionItemId: itemDto.collectionItemId,
      collectionId: String(itemDto.collectionId),
      contentTitle: itemDto.contentTitle, 
      contentType: itemDto.contentType,    
      addedAt: itemDto.addedAt,
      itemOrder: itemDto.itemOrder, 
      contentId: itemDto.contentId,
    })) : [],
    userName: dto.userName,
  };
}

export async function addToCollection(payload: AddToCollectionPayload) {
  const res = await api.post('/api/collections/add-to-collection', payload); 
  return res.data;
}
export async function addCollectionItemToSelectedCollection(payload: CollectionItemDTO) {
    const res = await api.post('/api/collections/add-item', payload);
      return res.data; 
}
export async function addCollectionItemToExisting(collectionId: number, itemDto: CollectionItemDTO) {
    // collectionId는 이제 URL 경로가 아닌, itemDto 내부에 포함됩니다.
    // 기존 itemDto에 collectionId가 이미 있거나, 없으면 새로 추가합니다.
    const payload = { ...itemDto, collectionId: collectionId };
    const res = await api.post(`/api/collections/add-item`, payload); // ⭐ 엔드포인트 변경 ⭐
    return res.data;
}

export async function deleteCollectionItem(collectionId: number, itemId: number) {
    const res = await api.delete(`/api/collections/${collectionId}/items/${itemId}`);
    return res.data;
}

// --- 순서 관련 API 함수 유지 및 타입 명확화 ---

export async function updateCollectionItemsOrder(
    collectionId: string,
    itemIdsInOrder: string[] // 순서대로 정렬된 아이템 ID 리스트
): Promise<void> {
    const res = await api.put(`/api/collections/${collectionId}/items/reorder`, itemIdsInOrder);
    return res.data;
}

// ⭐ `updateCollectionItemsFull` 타입 명확화: `collectionItemId`를 `id`로 변경 ⭐
export async function updateCollectionItemsFull(
    collectionId: string,
    updatedItems: Array<{ id: number; itemOrder: number }> // ⭐ collectionItemId 대신 id로 변경 ⭐
): Promise<void> {
    const res = await api.put(`/api/collections/${collectionId}/items/full-update`, updatedItems);
    return res.data; 
}
