// lib/api/collections.ts
import api from './base';
import type { Collection } from '@/types/collection';

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

// 백엔드에서 userId를 기반으로 필터링된 컬렉션을 가져오도록 수정 (가정)

export async function fetchCollections(): Promise<Collection[]> {
  // 백엔드에서 PrincipalDetails를 통해 사용자 ID를 가져오므로
  // 프론트에서 별도로 userId를 쿼리 파라미터로 보낼 필요가 없습니다.
  // 다만, 'api' 인스턴스가 JWT 토큰을 헤더에 잘 포함시켜 보내야 합니다.
  const res = await api.get('/api/collections/user-collections'); // 백엔드 @GetMapping("/collections")를 호출
  
  return res.data.map((dto: any) => ({
    id: String(dto.collectionId),
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    items: [], // 아이템 연동은 추후 구현
  }));
}

export async function fetchCollection(id: string): Promise<Collection> {
  const res = await api.get(`/api/collections/${id}`);
  const dto = res.data;
  return {
    id: String(dto.collectionId),
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    items: [],
  };
}