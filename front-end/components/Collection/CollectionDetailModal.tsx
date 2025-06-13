// components/Collection/CollectionDetailModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
// Collection과 CollectionItem 타입을 임포트합니다. ReOrderItems는 이제 필요 없을 수 있습니다.
import type { Collection, CollectionItem } from '@/types/collection';
import { Music, Activity, Book } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CollectionDetailModalProps {
    isOpen: boolean;
    // 변경: 모달이 닫힐 때 업데이트된 Collection 객체를 전달할 수 있도록 onClose 시그니처 변경
    onClose: (updatedCollection?: Collection) => void; 
    collection: Collection | null;
    onDeleteItem?: (collectionId: string, itemId: string) => Promise<void>;
    // 변경: onReorderItems는 여전히 Promise<void>를 반환합니다.
    onReorderItems?: (collectionId: string, newItems: CollectionItem[]) => Promise<void>; 
}

const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
    isOpen,
    onClose,
    collection,
    onDeleteItem,
    onReorderItems, 
}) => {
    // 모달 내부에서 아이템 순서 변경을 관리할 상태
    const [items, setItems] = useState<CollectionItem[]>([]);
    // 변경 사항이 있는지 추적하는 상태 (저장 버튼 활성화/비활성화용)
    const [isChanged, setIsChanged] = useState(false);

    // collection prop이 변경될 때마다 items 상태를 초기화하고 정렬합니다.
    useEffect(() => {
        if (collection?.items) {
            // collection.items를 복사하여 정렬하고 setItems를 통해 상태 업데이트
            setItems(collection.items.slice().sort((a, b) => a.itemOrder - b.itemOrder));
            setIsChanged(false); // 새로운 컬렉션이 로드되면 변경 상태 초기화

            // 디버깅을 위한 로그 (중복 ID 확인)
            console.log("Collection items with IDs:", collection.items.map(item => item.collectionItemId));
            const ids = collection.items.map(item => item.collectionItemId);
            const uniqueIds = new Set(ids);
            if (ids.length !== uniqueIds.size) {
                console.error("Warning: Duplicate collectionItemIds found!", ids.filter((e, i, a) => a.indexOf(e) !== i));
            }
        }
    }, [collection]); // collection prop을 의존성 배열에 추가

    // 모달이 열려있지 않거나 collection 데이터가 없으면 렌더링하지 않음
    if (!isOpen || !collection) return null;

    // 아이템 삭제 핸들러
    const handleItemDelete = async (itemId: string) => {
        if (onDeleteItem) {
            const collectionIdAsString = String(collection.collectionId); 
            
            try {
                // 부모 컴포넌트의 onDeleteItem 호출
                await onDeleteItem(collectionIdAsString, itemId);
                
                // UI에서 즉시 삭제된 아이템 반영
                const newItems = items.filter(item => String(item.collectionItemId) !== itemId);
                setItems(newItems);
                setIsChanged(true); // 삭제도 변경으로 간주하여 저장 버튼 활성화 (필요하다면)

                // ⭐ 중요: 삭제 후에도 상위 컴포넌트의 collection 상태를 업데이트해야 할 경우
                // 이 모달을 닫았을 때, 상위 컴포넌트의 컬렉션 목록을 다시 fetch하거나
                // onClose를 통해 업데이트된 컬렉션 객체를 전달하는 방법이 필요.
                // 현재 onDeleteItem은 CollectionPage에서 collection 상태를 직접 업데이트하고 있으므로,
                // 이 모달을 닫을 때 별도로 updatedCollection을 전달하지 않아도 됩니다.
                // (만약 삭제 후 모달이 닫히지 않고 계속 열려있다면, setSelectedCollection도 업데이트 필요)

            } catch (error: any) {
                if (error.message === 'Deletion cancelled by user.') {
                    console.log('Item deletion cancelled.');
                } else {
                    console.error('아이템 삭제 중 오류 발생:', error);
                    // alert 대신 커스텀 모달 사용 권장
                    window.alert('아이템 삭제에 실패했습니다.');
                }
            }
        } else {
            console.warn("onDeleteItem prop이 제공되지 않아 아이템 삭제 기능을 사용할 수 없습니다.");
        }
    };

    // 드래그 앤 드롭 종료 시 호출되는 핸들러
    const onDragEnd = (result: DropResult) => {
        // 드롭 대상이 없으면 (예: 원래 위치로 돌아가거나 유효하지 않은 곳에 드롭)
        if (!result.destination) {
            return;
        }

        // onReorderItems prop이 제공되지 않았으면 순서 변경 비활성화
        if (!onReorderItems) {
            console.warn("순서 변경 기능이 활성화되지 않았습니다.");
            return;
        }

        // 현재 아이템 목록을 복사하여 순서 재배열
        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        // UI에 즉시 반영 (로컬 상태 업데이트)
        setItems(reorderedItems); 
        setIsChanged(true); // 순서가 변경되었음을 표시하여 저장 버튼 활성화
    };

    // '저장' 버튼 클릭 핸들러
    const handleSave = async () => {
        // onReorderItems prop이 없거나, 컬렉션이 없거나, 변경 사항이 없으면 저장 없이 닫기
        if (!onReorderItems || !collection || !isChanged) {
            onClose(); // 변경 사항이 없으므로 인자 없이 onClose 호출
            return;
        }

        // 현재 items 상태를 기반으로 itemOrder를 재설정
        // CollectionItem 타입은 이미 collectionItemId와 itemOrder를 포함하므로 별도의 매핑 필요 없음
        const itemsToSave: CollectionItem[] = items.map((item, index) => ({
            ...item,           // 기존 아이템의 모든 속성 복사
            itemOrder: index   // 새로운 순서로 itemOrder 업데이트
        }));

        try {
            // 부모 컴포넌트의 onReorderItems 호출 (DB 저장 로직 포함)
            // onReorderItems는 Promise<void>를 반환합니다.
            await onReorderItems(String(collection.collectionId), itemsToSave);
            
            setIsChanged(false); // 저장 완료 후 변경 상태 초기화

            // ⭐ 핵심: DB 저장 성공 후, 부모 컴포넌트의 collection 상태를 업데이트하기 위해
            // 새로운 collection 객체를 생성하여 onClose 콜백으로 전달
            const updatedCollection: Collection = { 
                ...collection,       // 기존 컬렉션 정보 유지
                items: itemsToSave   // 새로 저장된 순서의 아이템 목록으로 업데이트
            };
            onClose(updatedCollection); // ⭐ 업데이트된 컬렉션 데이터를 전달하며 모달 닫기

        } catch (error) {
            console.error("아이템 순서 저장 중 오류 발생:", error);
            // alert 대신 커스텀 모달 사용 권장
            window.alert('아이템 순서 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 오버레이 클릭 시 모달 닫기 핸들러 (저장되지 않은 변경 사항 확인)
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            // onReorderItems가 있고 변경 사항이 있을 때만 경고 메시지 표시
            if (onReorderItems && isChanged && !window.confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")) {
                return; // 사용자가 취소하면 모달을 닫지 않음
            }
            onClose(); // 변경 사항이 없거나 사용자가 닫기 확인 시 인자 없이 onClose 호출
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div 
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 오버레이 클릭 방지
            >
                {/* 헤더 섹션 */}
                <div className="sticky top-0 bg-white pt-0 pb-4 z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {collection.name} 상세 아이템
                        </h2>
                        {/* 닫기 버튼 */}
                        <button
                            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                            onClick={() => {
                                // onReorderItems가 있고 변경 사항이 있을 때만 경고 메시지 표시
                                if (onReorderItems && isChanged && !window.confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")) {
                                    return;
                                }
                                onClose(); // 모달 닫기
                            }}
                        >
                            &times; 
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4">{collection.description || '설명 없음'}</p>

                    <h3 className="text-lg font-semibold border-b pb-2">
                        아이템 목록 
                        {onReorderItems && <span className="ml-2 text-sm text-gray-500">(드래그하여 순서 변경)</span>}
                    </h3>
                </div>

                {/* 스크롤 가능한 아이템 목록 섹션 */}
                <div className="flex-1 overflow-y-auto -mx-8 px-8">
                    {items.length > 0 ? (
                        <DragDropContext onDragEnd={onDragEnd}>
                            {/* onReorderItems가 없을 때는 드롭 기능 비활성화 */}
                            <Droppable droppableId="collection-items" isDropDisabled={!onReorderItems}>
                                {(provided) => (
                                    <ul 
                                        className="space-y-3 pt-2"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {items.map((item: CollectionItem, index: number) => (
                                            <Draggable 
                                                key={String(item.collectionItemId)} // key는 반드시 string이어야 합니다.
                                                draggableId={String(item.collectionItemId)} // draggableId도 string
                                                index={index}
                                                // onReorderItems가 없을 때는 드래그 기능 비활성화
                                                isDragDisabled={!onReorderItems} 
                                            >
                                                {(provided, snapshot) => (
                                                    <li 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        // onReorderItems가 있을 때만 dragHandleProps 적용 (드래그 가능한 영역)
                                                        {...(onReorderItems ? provided.dragHandleProps : {})} 
                                                        className={`
                                                            bg-gray-50 p-3 rounded-md flex items-center gap-3 relative
                                                            ${snapshot.isDragging ? 'shadow-lg bg-blue-100' : ''}
                                                            ${!onReorderItems ? 'cursor-default' : ''} {/* 드래그 불가능할 때 커서 변경 */}
                                                        `}
                                                    >
                                                        <span className="text-xl">
                                                            {item.contentType === 'music' && <Music className="w-4 h-4" />}
                                                            {item.contentType === 'activity' && <Activity className="w-4 h-4" />}
                                                            {item.contentType === 'book' && <Book className="w-4 h-4" />}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-lg font-medium">{item.contentTitle}</p>
                                                            <p className="text-sm text-gray-500">
                                                                추가됨: {new Date(item.addedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {onDeleteItem && (
                                                            <button
                                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl p-1 rounded-full hover:bg-gray-100"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); 
                                                                    // alert 대신 커스텀 모달 사용 권장
                                                                    if (window.confirm(`"${item.contentTitle}" 아이템을 정말 삭제하시겠습니까?`)) {
                                                                        handleItemDelete(String(item.collectionItemId));
                                                                    }
                                                                }}
                                                                aria-label={`"${item.contentTitle}" 아이템 삭제`}
                                                            >
                                                                &times;
                                                            </button>
                                                        )}
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder} {/* 드래그 중인 아이템이 차지하던 공간 */}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
                        <p className="text-gray-500 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
                    )}
                </div>

                {/* 푸터 섹션 */}
                <div className="sticky bottom-0 bg-white pt-4 pb-0 z-10">
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">
                            이 컬렉션은 {collection.userName || ''}님의 컬렉션입니다.
                        </p>
                        <div className="flex space-x-2">
                            {/* <button
                                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => {
                                    // onReorderItems가 있고 변경 사항이 있을 때만 경고 메시지 표시
                                    if (onReorderItems && isChanged && !window.confirm("저장되지 않은 변경 사항이 있습니다. 정말 취소하고 닫으시겠습니까?")) {
                                        return;
                                    }
                                    onClose(); // 모달 닫기
                                }}
                            >
                                취소
                            </button> */}
                            {/* 저장 버튼은 onReorderItems prop이 있을 때만 렌더링하고, 변경 사항이 있을 때만 활성화 */}
                            {onReorderItems && (
                                <button
                                    className={`px-5 py-2 rounded-lg ${isChanged ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    onClick={handleSave}
                                    disabled={!isChanged} 
                                >
                                    저장
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailModal;

