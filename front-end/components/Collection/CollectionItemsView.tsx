// components/Collection/CollectionItemsView.tsx
"use client";

import React from 'react'; // useState, useEffect, useCallback은 더 이상 직접 사용하지 않으므로 제거
import type { Collection, CollectionItem } from '@/types/collection';
import { Music, Activity, Book, X } from "lucide-react";
import { Droppable, Draggable } from '@hello-pangea/dnd';

// 필요한 API 함수 임포트 (deleteCollectionItem은 MainLayout에서 호출되므로 제거)
// import { deleteCollectionItem } from "@/lib/api/collections"; // 제거

interface CollectionItemsViewProps {
  collection: Collection;
  // onDeleteItemConfirmed는 MainLayout에서 관리하므로 그대로 유지
  onDeleteItemConfirmed: (collectionId: string, itemId: string) => Promise<void>;
  
  // 뷰를 닫는 버튼을 위한 콜백
  onCloseView?: (collectionId: string) => void;
}

const CollectionItemsView: React.FC<CollectionItemsViewProps> = ({
  collection,
  onDeleteItemConfirmed,
  onCloseView,
}) => {
  // 아이템 삭제 핸들러는 그대로 유지
  const handleItemDelete = async (itemId: string) => {
    try {
      // onDeleteItemConfirmed는 부모로부터 전달받은 콜백이므로 그대로 사용
      await onDeleteItemConfirmed(String(collection.collectionId), itemId);
    } catch (err: any) {
      console.error("CollectionItemsView: 아이템 삭제 중 오류 발생 (부모에서 처리됨):", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full relative border border-gray-200 dark:border-gray-700">
      {onCloseView && (
        <button
          onClick={() => onCloseView(String(collection.collectionId))}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 rounded-full p-1 transition-colors duration-200"
          aria-label="Close collection view"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex justify-between items-center mb-4 pr-8">
        <h2 className="text-2xl font-bold">{collection.name}</h2>
        <span className={`text-xs px-2 py-1 rounded ${collection.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {collection.isPublic ? '공개' : '비공개'}
        </span>
      </div>
      <p className="text-gray-600 mb-6">{collection.description || '설명 없음'}</p>

      <h3 className="text-lg font-semibold border-b pb-2 mb-4">
        아이템 목록 <span className="ml-2 text-sm text-gray-500">(드래그하여 순서 변경)</span>
      </h3>

      <div className="flex-1 overflow-y-auto pr-2">
        <Droppable droppableId={String(collection.collectionId)} type="COLLECTION_ITEM">
          {/* ⭐ 여기부터 중요: Droppable의 자식은 이제 '하나의 함수'입니다. ⭐ */}
          {(provided, snapshot) => (
            <ul
              className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {collection.items && collection.items.length > 0 ? (
                // 아이템 순서를 itemOrder 기준으로 정렬하여 렌더링
                collection.items.slice().sort((a, b) => a.itemOrder - b.itemOrder).map((item: CollectionItem, index: number) => (
                  <Draggable
                    key={String(item.collectionItemId)} // key는 string이여야 안전
                    draggableId={String(item.collectionItemId)} // draggableId도 string이여야 안전
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          bg-gray-50 p-4 rounded-md flex items-center gap-4 relative
                          ${snapshot.isDragging ? 'shadow-lg bg-blue-100' : ''}
                          hover:bg-gray-100 transition-colors duration-200
                        `}
                      >
                        <span className="flex-shrink-0">
                          {item.contentType === 'music' && <Music className="w-5 h-5 text-purple-600" />}
                          {item.contentType === 'activity' && <Activity className="w-5 h-5 text-orange-600" />}
                          {item.contentType === 'book' && <Book className="w-5 h-5 text-blue-600" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-gray-800 truncate">{item.contentTitle}</p>
                          <p className="text-sm text-gray-500 truncate">
                            추가됨: {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 text-xl p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemDelete(String(item.collectionItemId));
                          }}
                          aria-label={`"${item.contentTitle}" 아이템 삭제`}
                        >
                          &times;
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
              )}
              {/* ⭐ placeholder는 ul 안에 있어야 합니다. ⭐ */}
              {provided.placeholder}
            </ul>
          )}
          {/* ⭐ Droppable의 자식으로 함수가 끝났습니다. ⭐ */}
        </Droppable>
      </div>
      <div className="pt-4 border-t mt-6 text-center text-gray-500 text-sm">
        이 컬렉션은 {collection.userName || ''}님의 컬렉션입니다.
      </div>
    </div>
  );
};

export default CollectionItemsView;
