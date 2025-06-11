// lib/api/collections.ts
// import axios from 'axios';
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

export async function fetchCollections(): Promise<Collection[]> {
  const res = await api.get('/api/collections');
  // mapBackendCollection과 동일한 매핑 적용
  return res.data.map((dto: any) => ({
    id: String(dto.id),
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
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    items: [],
  };
}
