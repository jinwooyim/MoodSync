// lib/api/collections.ts
import api from './base';
import type { Collection, CollectionItem } from '@/types/collection'; // CollectionItem도 import

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
      contentTitle: itemDto.contentTitle, // ★ contentTitle 매핑
      contentType: itemDto.contentType,   // ★ contentType 매핑 유지
      addedAt: itemDto.addedAt,
    })) : [],
  }));
}

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
        contentTitle: itemDto.contentTitle, // ★ contentTitle 매핑
        contentType: itemDto.contentType,   // ★ contentType 매핑 유지
        addedAt: itemDto.addedAt,
    })) : [],
  };
}