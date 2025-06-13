// app/(main)/layout.tsx
"use client";
import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { Calendar, TrendingUp, BookOpen, BarChart3, List } from "lucide-react"
import { useState, useEffect, useCallback } from "react"; // useCallback 임포트 추가
import { DragDropContext, DropResult } from '@hello-pangea/dnd'; // DragDropContext, DropResult 임포트 추가

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
// API 함수 임포트 추가
import { deleteCollectionItem, addCollectionItemToExisting, updateCollectionItemsFull } from '@/lib/api/collections';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { collections, loading, error, refetchCollections } = useCollections();
  
  // ⭐ 선택된 컬렉션 ID들을 저장하는 배열 상태 ⭐
  const [openedCollectionIds, setOpenedCollectionIds] = useState<string[]>([]);

  // 사이드바 컬렉션 버튼 클릭 핸들러 (다시 추가)
  const handleCollectionClick = useCallback((collectionId: string) => {
    setOpenedCollectionIds(prevIds => {
      if (prevIds.includes(collectionId)) {
        // 이미 열려 있으면 닫기 (제거)
        return prevIds.filter(id => id !== collectionId);
      } else {
        // 안 열려 있으면 열기 (추가)
        return [...prevIds, collectionId];
      }
    });
  }, []);

  // "새 컬렉션 만들기" 버튼 클릭 핸들러 (다시 추가)
  const handleCreateCollectionClick = useCallback(() => {
    // ⭐ 모든 컬렉션 뷰를 닫고, 기본 children (예: 컬렉션 목록 페이지)을 렌더링 ⭐
    setOpenedCollectionIds([]);
    // 필요하다면 이곳에서 router.push('/collections?action=create') 등을 호출할 수 있습니다.
  }, []);

  // CollectionItemsView에서 컬렉션 뷰를 닫는 핸들러 (X 버튼 클릭 시)
  const handleCloseCollectionView = useCallback((collectionIdToClose: string) => {
    setOpenedCollectionIds(prevIds => prevIds.filter(id => id !== collectionIdToClose));
  }, []);

  // CollectionItemsView에서 아이템 삭제가 확정되었을 때 호출될 핸들러
  // 이 핸들러에서 API 호출 및 전체 컬렉션 새로고침을 처리합니다.
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

    // 1. 드롭 대상이 없으면 아무것도 하지 않음
    if (!destination) {
      return;
    }

    // 2. 같은 위치에 드롭했으면 아무것도 하지 않음
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // 드래그된 아이템 객체를 찾습니다.
    const draggedItem = collections.flatMap(col => col.items)
      .find(item => String(item.collectionItemId) === draggableId);

    if (!draggedItem) {
      console.error("onDragEnd: 드래그된 아이템을 찾을 수 없습니다.");
      return;
    }

    // 원본 컬렉션과 대상 컬렉션 찾기
    const sourceCollection = collections.find(col => String(col.collectionId) === source.droppableId);
    const destinationCollection = collections.find(col => String(col.collectionId) === destination.droppableId);

    if (!sourceCollection || !destinationCollection) {
      console.error("onDragEnd: 원본 또는 대상 컬렉션을 찾을 수 없습니다.");
      return;
    }

    // 3. 같은 컬렉션 내에서 순서만 변경 (Reorder)
    if (source.droppableId === destination.droppableId) {
      console.log(`컬렉션 내부 순서 변경: ${source.droppableId}`);
      const itemsInCollection = [...sourceCollection.items].sort((a,b) => a.itemOrder - b.itemOrder);
      const [movedItem] = itemsInCollection.splice(source.index, 1);
      itemsInCollection.splice(destination.index, 0, movedItem);

      // 새로운 순서로 itemOrder 업데이트
      const updatedItemsPayload = itemsInCollection.map((item, index) => ({
        collectionItemId: item.collectionItemId,
        itemOrder: index,
      }));

      try {
        await updateCollectionItemsFull(source.droppableId, updatedItemsPayload);
        window.alert("아이템 순서가 성공적으로 변경되었습니다.");
        await refetchCollections();
      } catch (error) {
        console.error("컬렉션 내부 순서 변경 실패:", error);
        window.alert("아이템 순서 변경에 실패했습니다.");
        await refetchCollections();
      }
    }
    // 4. 다른 컬렉션으로 아이템 이동 (Move between lists)
    else {
      console.log(`컬렉션 간 이동: ${source.droppableId} -> ${destination.droppableId}`);
      // 원본 컬렉션에서 아이템 제거
      const sourceItems = [...sourceCollection.items].filter(item => String(item.collectionItemId) !== draggableId).sort((a,b) => a.itemOrder - b.itemOrder);
      // 대상 컬렉션에 아이템 추가 및 순서 조정
      const destinationItems = [...destinationCollection.items].sort((a,b) => a.itemOrder - b.itemOrder);

      const itemDtoForNewCollection = {
        
        contentTitle: draggedItem.contentTitle,
        // ⭐ 타입 캐스팅을 추가하여 TypeScript 오류 해결 ⭐
        contentType: draggedItem.contentType as "music" | "activity" | "book", 
        contentId: draggedItem.contentId || '', 
        itemOrder: destination.index,
      };

      try {
        // 1. 원본 컬렉션에서 아이템 삭제 (API 호출)
        await deleteCollectionItem(Number(source.droppableId), Number(draggableId));
        
        // 2. 대상 컬렉션에 아이템 추가 (API 호출)
        const newItemResponse = await addCollectionItemToExisting(Number(destination.droppableId), itemDtoForNewCollection);

        // 3. 두 컬렉션의 순서 업데이트
        // 원본 컬렉션의 아이템 순서 업데이트
        const updatedSourceItemsPayload = sourceItems.map((item, index) => ({
          collectionItemId: item.collectionItemId,
          itemOrder: index,
        }));
        await updateCollectionItemsFull(source.droppableId, updatedSourceItemsPayload); 
        
        // 대상 컬렉션의 순서는 새로 추가된 아이템을 포함하여 refetchCollections가 처리할 것입니다.
        // 만약 필요하다면 대상 컬렉션 아이템의 순서도 명시적으로 업데이트하는 로직을 추가할 수 있습니다.
        // 예를 들어:
        // const updatedDestinationItemsPayload = [...destinationItems, { collectionItemId: newItemResponse.collectionItemId, itemOrder: destination.index }]
        //   .sort((a, b) => a.itemOrder - b.itemOrder)
        //   .map((item, index) => ({ collectionItemId: item.collectionItemId, itemOrder: index }));
        // await updateCollectionItemsFull(destination.droppableId, updatedDestinationItemsPayload);

        window.alert("아이템이 컬렉션 간 성공적으로 이동되었습니다.");
        await refetchCollections(); // 전체 컬렉션 새로고침 (새로 생성된 ID 및 순서 반영)
      } catch (error) {
        console.error("컬렉션 간 이동 실패:", error);
        window.alert("아이템 이동에 실패했습니다.");
        await refetchCollections();
      }
    }
  }, [collections, refetchCollections]); // 의존성 배열에 collections와 refetchCollections 포함

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SidebarProvider>
        <div className="flex flex-grow">
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
                      {collections.map((collection) => (
                        <SidebarMenuItem key={String(collection.collectionId)}>
                          <SidebarMenuButton
                            onClick={() => handleCollectionClick(String(collection.collectionId))}
                            className={openedCollectionIds.includes(String(collection.collectionId)) ? "bg-indigo-500 text-white" : ""}
                          >
                            <List className="size-4" /> {collection.name}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
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
            <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-wrap gap-8">
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
    </div>
  );
}
