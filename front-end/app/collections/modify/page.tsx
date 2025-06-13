// app/(main)/layout.tsx
"use client";
import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { Calendar, TrendingUp, BookOpen, BarChart3, List } from "lucide-react"
import { useState, useEffect, useCallback } from "react";
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import CollectionFormModal from "@/components/Collection/CollectionFormModal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useCollections } from "@/hooks/useCollections";
import CollectionItemsView from "@/components/Collection/CollectionItemsView";
import type { Collection, CollectionItem } from '@/types/collection';
// API 함수 임포트
import { createCollection, updateCollection, deleteCollectionItem, addCollectionItemToExisting, updateCollectionItemsFull } from "@/lib/api/collections";
import { useRouter } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { collections, loading, error, refetchCollections, setCollections } = useCollections(); 
  
  const [openedCollectionIds, setOpenedCollectionIds] = useState<string[]>([]);
  const router = useRouter();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  
  const handleFormSubmit = async (
    name: string,
    description: string,
    isPublic: boolean,
    collectionId?: string
  ) => {
    try {
      if (collectionId) {
        // 기존 컬렉션 수정
        const collectionIdAsNumber = Number(collectionId);
        if (isNaN(collectionIdAsNumber)) {
          window.alert("수정할 컬렉션 ID가 유효하지 않습니다. 다시 시도해주세요.");
          return;
        }
        await updateCollection({
          collectionId: collectionIdAsNumber,
          name,
          description,
          isPublic,
        });
        window.alert("컬렉션이 성공적으로 수정되었습니다.");
      } else {
        // 새 컬렉션 생성
        await createCollection({ name, description, isPublic });
        window.alert("컬렉션이 성공적으로 생성되었습니다.");
      }

      setShowFormModal(false); // 모달 닫기
      setEditingCollection(null); // 수정 중인 컬렉션 초기화
      // ⭐ 생성 또는 수정 후 항상 전체 컬렉션을 새로고침하여 안정적인 ID를 확보 ⭐
      await refetchCollections(); 
    } catch (e: any) {
      console.error("API 호출 중 오류 발생:", e);
      if (e instanceof Error && e.message === 'Unauthorized') {
        window.alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
        router.push('/user/login');
        return;
      }
      const errorMessage = e.response?.data?.message || e.message || '알 수 없는 오류';
      window.alert(`작업에 실패했습니다: ${errorMessage}`);
    }
  };

  // 사이드바 컬렉션 버튼 클릭 핸들러
  const handleCollectionClick = useCallback((collectionId: string) => {
    setOpenedCollectionIds(prevIds => {
      if (prevIds.includes(collectionId)) {
        return prevIds.filter(id => id !== collectionId);
      } else {
        return [...prevIds, collectionId];
      }
    });
  }, []);

  // "새 컬렉션 만들기" 버튼 클릭 핸들러 (모달 열기)
  const handleCreateCollectionClick = useCallback(() => {
    setEditingCollection(null); // 새 컬렉션이므로 편집 중인 컬렉션 없음
    setShowFormModal(true); // 모달 열기
  }, []);

  // CollectionItemsView에서 컬렉션 뷰를 닫는 핸들러 (X 버튼 클릭 시)
  const handleCloseCollectionView = useCallback((collectionIdToClose: string) => {
    setOpenedCollectionIds(prevIds => prevIds.filter(id => id !== collectionIdToClose));
  }, []);

  // CollectionItemsView에서 아이템 삭제가 확정되었을 때 호출될 핸들러
  const handleDeleteItemConfirmed = useCallback(async (collectionId: string, itemId: string) => {
    if (!window.confirm(`정말로 이 아이템을 컬렉션에서 삭제하시겠습니까?`)) {
      throw new Error('Deletion cancelled by user.');
    }
    try {
      await deleteCollectionItem(Number(collectionId), Number(itemId));
      window.alert("아이템이 성공적으로 삭제되었습니다.");
      await refetchCollections();
    } catch (err: any) {
      console.error("메인 레이아웃: 아이템 삭제 중 오류 발생:", err);
      if (err.message !== 'Deletion cancelled by user.') {
        window.alert(`아이템 삭제에 실패했습니다: ${err.message || '알 수 없는 오류'}`);
      }
      throw err;
    }
  }, [refetchCollections]);

  // DND 로직의 핵심: onDragEnd 핸들러
  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const draggedItem = collections.flatMap(col => col.items)
      .find(item => String(item.collectionItemId) === draggableId);

    if (!draggedItem) {
      console.error("onDragEnd: 드래그된 아이템을 찾을 수 없습니다.");
      return;
    }

    const sourceCollection = collections.find(col => String(col.collectionId) === source.droppableId);
    const destinationCollection = collections.find(col => String(col.collectionId) === destination.droppableId);

    if (!sourceCollection || !destinationCollection) {
      console.error("onDragEnd: 원본 또는 대상 컬렉션을 찾을 수 없습니다.");
      return;
    }

    try {
      if (source.droppableId === destination.droppableId) {
        // 같은 컬렉션 내에서 순서만 변경 (Reorder)
        console.log(`컬렉션 내부 순서 변경: ${source.droppableId}`);
        const itemsInCollection = [...sourceCollection.items].sort((a,b) => a.itemOrder - b.itemOrder);
        const [movedItem] = itemsInCollection.splice(source.index, 1);
        itemsInCollection.splice(destination.index, 0, movedItem);

        const updatedItemsPayload = itemsInCollection.map((item, index) => ({
          id: item.collectionItemId, // collectionItemId 대신 id로 변경
          itemOrder: index,
        }));

        await updateCollectionItemsFull(source.droppableId, updatedItemsPayload);
        window.alert("아이템 순서가 성공적으로 변경되었습니다.");
      } else {
        // 다른 컬렉션으로 아이템 이동 (Move between lists)
        console.log(`컬렉션 간 이동: ${source.droppableId} -> ${destination.droppableId}`);
        
        // 1. 원본 컬렉션에서 아이템 삭제 (API 호출)
        await deleteCollectionItem(Number(source.droppableId), Number(draggableId));
        
        // 2. 대상 컬렉션에 아이템 추가 (API 호출)
        const itemDtoForNewCollection = {
          collectionId: Number(destination.droppableId), // DTO에 collectionId 포함
          contentTitle: draggedItem.contentTitle,
          contentType: draggedItem.contentType as "music" | "activity" | "book", 
          contentId: draggedItem.contentId || '', 
          itemOrder: destination.index, // 새로운 위치에 대한 초기 순서
        };
        await addCollectionItemToExisting(Number(destination.droppableId), itemDtoForNewCollection);

        // 3. 원본 컬렉션의 남은 아이템 순서 재정렬 및 업데이트
        const sourceItemsRemaining = sourceCollection.items
          .filter(item => String(item.collectionItemId) !== draggableId)
          .sort((a,b) => a.itemOrder - b.itemOrder);
        const updatedSourceItemsPayload = sourceItemsRemaining.map((item, index) => ({
          id: item.collectionItemId, // collectionItemId 대신 id로 변경
          itemOrder: index,
        }));
        await updateCollectionItemsFull(source.droppableId, updatedSourceItemsPayload); 
        
        window.alert("아이템이 컬렉션 간 성공적으로 이동되었습니다.");
      }
      
      await refetchCollections(); // 모든 작업 성공 후 전체 컬렉션 새로고침
    } catch (error: any) {
      console.error("DND 작업 실패:", error);
      window.alert(`아이템 이동/순서 변경에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
      await refetchCollections(); // 오류 시 롤백 (이전 상태로 복원)
    }
  }, [collections, refetchCollections, setCollections]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SidebarProvider>
        <div className="flex flex-grow ">
          <Sidebar className="flex pt-[70px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-pink-500 dark:bg-pink-600 text-white transition-colors duration-300">
                  <Calendar className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    감정 대시보드
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Emotion Tracker
                  </span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  나의 컬렉션
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  {loading ? (
                    <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">컬렉션 로딩 중...</p>
                  ) : error ? (
                    <p className="px-4 py-2 text-sm text-red-500">{error}</p>
                  ) : collections.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">컬렉션이 없습니다.</p>
                  ) : (
                    <SidebarMenu>
                      {collections.map((collection) => {
                        // ⭐ Debugging: Log collection IDs to find the source of 'undefined' keys ⭐
                        console.log(`SidebarMenuItem key for collection ID: ${collection.collectionId}`);
                        return (
                          <SidebarMenuItem key={String(collection.collectionId)}>
                            <SidebarMenuButton
                              onClick={() => handleCollectionClick(String(collection.collectionId))}
                              className={openedCollectionIds.includes(String(collection.collectionId)) ? "bg-indigo-500 text-white" : ""}
                            >
                              <List className="size-4" /> {collection.name}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                      <SidebarMenuItem key={"create-new-collection"}>
                        <SidebarMenuButton onClick={handleCreateCollectionClick}>
                          <List className="size-4" /> + 새 컬렉션 만들기
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>

          {/* DragDropContext를 메인 콘텐츠 영역을 감싸도록 이동 */}
          <DragDropContext onDragEnd={onDragEnd}>
            <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-wrap gap-8">
              {openedCollectionIds.length > 0 ? (
                openedCollectionIds.map(id => {
                  const collectionToDisplay = collections.find(col => String(col.collectionId) === id);
                  if (collectionToDisplay) {
                    return (
                      <div key={id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 min-w-[300px]">
                        <CollectionItemsView
                          collection={collectionToDisplay}
                          onDeleteItemConfirmed={handleDeleteItemConfirmed}
                          onCloseView={handleCloseCollectionView}
                        />
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                children
              )}
            </main>
          </DragDropContext>
        </div>
      </SidebarProvider>
      {/* 컬렉션 생성/수정 모달은 레이아웃에 직접 렌더링 */}
      <CollectionFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCollection(null);
        }}
        editingCollection={editingCollection}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
