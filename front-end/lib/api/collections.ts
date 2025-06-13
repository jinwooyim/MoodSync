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
  collectionItemId: number;
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
    })) : [],
  }));
}

// 특정 컬렉션을 가져오는 함수
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
    })) : [],
    userName: dto.userName,
  };
}

// 메인화면 컬렉션에 아이템 추가
export async function addToCollection(payload: AddToCollectionPayload) {
  const res = await api.post('/api/collections/add-to-collection', payload); 
  return res.data;
}
export async function addCollectionItemToSelectedCollection(payload: CollectionItemDTO) {
  const res = await api.post('/api/collections/add-item', payload); // 백엔드의 `/api/collections/add-item` 엔드포인트 호출
  return res.data; 

}
// deleteCollectionItem 
export async function deleteCollectionItem(collectionId: number, itemId: number) {
    if (!confirm('정말로 이 아이템을 컬렉션에서 삭제하시겠습니까?')) {
        throw new Error('Deletion cancelled by user.'); 
    }

    const res = await api.delete(`/api/collections/${collectionId}/items/${itemId}`);
    return res.data;
}


// 컬렉션 아이템 순서 업데이트 API 함수
export async function updateCollectionItemsOrder(
    collectionId: string,
    itemIdsInOrder: string[] // 순서대로 정렬된 아이템 ID 리스트
): Promise<void> {
    // 이 함수도 api 인스턴스를 사용하는 것이 좋습니다.
    const res = await api.put(`/api/collections/${collectionId}/items/reorder`, itemIdsInOrder);
    return res.data;
}

// 이 함수가 updateCollectionItemsOrder보다 onDragEnd에서 newItems를 바로 전달하기 편리
export async function updateCollectionItemsFull(
    collectionId: string,
    updatedItems: Array<{ id: number; itemOrder: number }> // 또는 CollectionItem[]
): Promise<void> {
    // === 여기가 핵심 변경사항입니다: fetch 대신 api.put 사용 ===
    const res = await api.put(`/api/collections/${collectionId}/items/full-update`, updatedItems);
    // axios는 응답 상태가 2xx가 아니면 자동으로 에러를 던지므로, response.ok 체크는 필요 없습니다.
    return res.data; 
}
