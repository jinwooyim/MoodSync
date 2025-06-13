// components/CollectionDetailModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import type { Collection, CollectionItem } from '@/types/collection';
import { Music, Activity, Book } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface CollectionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection: Collection | null;
    onDeleteItem?: (collectionId: string, itemId: string) => Promise<void>;
    onReorderItems?: (collectionId: string, newItems: CollectionItem[]) => Promise<void>; 
}

const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
    isOpen,
    onClose,
    collection,
    onDeleteItem,
    onReorderItems, 
}) => {
    const [items, setItems] = useState<CollectionItem[]>([]);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        if (collection?.items) {
            setItems(collection.items.slice().sort((a, b) => a.itemOrder - b.itemOrder));
            setIsChanged(false); 
            // 디버깅을 위해 추가:
            console.log("Collection items with IDs:", collection.items.map(item => item.collectionItemId));
            const ids = collection.items.map(item => item.collectionItemId);
            const uniqueIds = new Set(ids);
            if (ids.length !== uniqueIds.size) {
                console.error("Warning: Duplicate collectionItemIds found!", ids.filter((e, i, a) => a.indexOf(e) !== i));
            }
        }
    }, [collection]);

    if (!isOpen || !collection) return null;

    const handleItemDelete = async (itemId: string) => {
        if (onDeleteItem) {
            const collectionIdAsString = String(collection.collectionId); 
            
            try {
                await onDeleteItem(collectionIdAsString, itemId);
                setItems(prevItems => {
                    const newItems = prevItems.filter(item => String(item.collectionItemId) !== itemId);
                    setIsChanged(true); // 삭제도 변경으로 간주
                    return newItems;
                });
            } catch (error: any) {
                if (error.message === 'Deletion cancelled by user.') {
                    console.log('Item deletion cancelled.');
                } else {
                    console.error('아이템 삭제 중 오류 발생:', error);
                    alert('아이템 삭제에 실패했습니다.');
                }
            }
        } else {
            console.warn("onDeleteItem prop이 제공되지 않아 아이템 삭제 기능을 사용할 수 없습니다.");
        }
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        // onReorderItems prop이 없으면 드래그 앤 드롭으로 인한 순서 변경 자체를 허용하지 않음
        if (!onReorderItems) {
            console.warn("순서 변경 기능이 활성화되지 않았습니다.");
            return;
        }

        const reorderedItems = Array.from(items);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setItems(reorderedItems); // UI 업데이트
        setIsChanged(true); // 순서가 변경되었음을 표시
    };

    // '저장' 버튼 클릭 핸들러: onReorderItems prop 유무와 상관없이 항상 선언됨
    const handleSave = async () => {
        if (!onReorderItems || !collection || !isChanged) {
            onClose();
            return;
        }

        const itemsToSave = items.map((item, index) => ({
            ...item,
            itemOrder: index
        }));

        try {
            await onReorderItems(String(collection.collectionId), itemsToSave);
            setIsChanged(false);
            onClose();
        } catch (error) {
            console.error("아이템 순서 저장 중 오류 발생:", error);
            alert('아이템 순서 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 일반 함수로 선언
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            if (onReorderItems && isChanged && !confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")) {
                return;
            }
            onClose();
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div 
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header Section */}
                <div className="sticky top-0 bg-white pt-0 pb-4 z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {collection.name} 상세 아이템
                        </h2>
                        {/* 닫기 버튼 */}
                        <button
                            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                            onClick={() => {
                                // onReorderItems가 있고 변경사항이 있을 때만 경고
                                if (onReorderItems && isChanged && !confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")) {
                                    return;
                                }
                                onClose();
                            }}
                        >
                            &times; 
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4">{collection.description || '설명 없음'}</p>

                    <h3 className="text-lg font-semibold border-b pb-2">
                        아이템 목록 
                        {onReorderItems && <span> (드래그하여 순서 변경)</span>}
                    </h3>
                </div>

                {/* Scrollable Content Section */}
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
                                                key={item.collectionItemId} 
                                                //얘는 string ID 필요
                                                draggableId={String(item.collectionItemId)}
                                                index={index}
                                                // onReorderItems가 없을 때는 드래그 기능 비활성화
                                                isDragDisabled={!onReorderItems} 
                                            >
                                                {(provided, snapshot) => (
                                                    <li 
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}

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
                                                                    handleItemDelete(String(item.collectionItemId));
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
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : (
                        <p className="text-gray-500 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
                    )}
                </div>

                {/* Fixed Footer Section */}
                <div className="sticky bottom-0 bg-white pt-4 pb-0 z-10">
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">
                            이 컬렉션은 **{collection.userName}**님의 컬렉션입니다.
                        </p>
                        <div className="flex space-x-2">
                            {/* 취소 버튼 */}
                            <button
                                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => {
                                    // onReorderItems가 있고 변경사항이 있을 때만 경고
                                    if (onReorderItems && isChanged && !confirm("저장되지 않은 변경 사항이 있습니다. 정말 취소하고 닫으시겠습니까?")) {
                                        return;
                                    }
                                    onClose(); 
                                }}
                            >
                                취소
                            </button>
                            {/* 저장 버튼은 onReorderItems prop이 있을 때만 렌더링 */}
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