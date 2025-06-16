// app/collection/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Collection, CollectionItem } from "@/types/collection";
import { fetchPublicCollections,copyCollectionToMyCollections, createCollection, updateCollection, deleteCollection, deleteCollectionItem, updateCollectionItemsFull } from "@/lib/api/collections";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';

import {
    containerVariants,
    cardVariants,
    overlayVariants,
    modalContentVariants
} from "@/lib/animations/framerVariants";

import CollectionCard from "@/components/Collection/CollectionCard";
import CollectionFormModal from "@/components/Collection/CollectionFormModal";
import CollectionDetailModal from "@/components/Collection/CollectionDetailModal";

export default function CollectionPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const [showFormModal, setShowFormModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    //수정/정렬 메시지를 보여줄 컬렉션 ID 상태 
    const [collectionIdToShowEditMessage, setCollectionIdToShowEditMessage] = useState<string | null>(null);
    const [collectionIdToShowReorderMessage, setCollectionIdToShowReorderMessage] = useState<string | null>(null);

    // 모달 닫기 핸들러 (브라우저 뒤로 가기)
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCollection(null);
        router.push('/collections/share');
    };
    
    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const fetchedCollections = await fetchPublicCollections();
                setCollections(fetchedCollections);

                const action = searchParams?.get('action');
                if (action === 'create') {
                    setShowFormModal(true);
                    setEditingCollection(null);
                }
            } catch (e) {
                if (e instanceof Error && e.message === 'Unauthorized') {
                    window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                    router.push('/user/login');
                    return;
                }
                console.error("Failed to fetch collections:", e);
                setError("컬렉션을 불러오는 데 실패했습니다."); // 에러 상태 설정
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, [searchParams, router]);

    const handleCopyCollection = async (collectionToCopy: Collection) => {
        try {
            await copyCollectionToMyCollections(String(collectionToCopy.collectionId));
            // window.alert(`'${collectionToCopy.name}' 컬렉션이 나의 컬렉션으로 복사되었습니다.`);
            handleCloseModal(); // 복사 성공 후 모달 닫기
            router.push('/collections'); // ⭐ 복사 후 나의 컬렉션 페이지로 이동 (선택 사항) ⭐
        } catch (error) {
            console.error("컬렉션 복사 중 오류 발생:", error);
            window.alert('컬렉션 복사에 실패했습니다. 다시 로그인하거나 나중에 시도해주세요.');
        }
    };

    // ⭐ 컬렉션 수정 버튼 클릭 핸들러 추가 ⭐
    const handleEditCollection = (collection: Collection) => {
        setEditingCollection(collection);
        setShowFormModal(true);
    };

    const handleFormSubmit = async (
        name: string,
        description: string,
        isPublic: boolean,
        collectionId?: string
    ) => {
        try {
            if (collectionId) {
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
                // ⭐ 수정 성공 시 메시지 표시 트리거 ⭐
                setCollectionIdToShowEditMessage(collectionId);
                // window.alert("컬렉션이 성공적으로 수정되었습니다."); // 기존 alert 제거
            } else {
                await createCollection({ name, description, isPublic });
                window.alert("컬렉션이 성공적으로 생성되었습니다."); // 생성 시에는 alert 유지
            }

            setShowFormModal(false);
            setEditingCollection(null);
            const newCollections = await fetchPublicCollections(); // 변경된 컬렉션 다시 불러오기
            setCollections(newCollections);
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

    // ⭐ CollectionCard에서 메시지 표시가 완료되면 호출될 콜백 ⭐
    const handleEditMessageShown = useCallback(() => {
        setCollectionIdToShowEditMessage(null); // 메시지 표시 완료 후 ID 초기화
    }, []);

    const handleDeleteCollection = async (collectionId: string) => {
        if (!window.confirm("정말로 이 컬렉션을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const collectionIdAsNumber = Number(collectionId);
            if (isNaN(collectionIdAsNumber)) {
                window.alert("삭제할 컬렉션 ID가 유효하지 않습니다.");
                return;
            }

            await deleteCollection(collectionIdAsNumber);
            setCollections(prevCollections =>
                prevCollections.filter(col => String(col.collectionId) !== collectionId)
            );
            // window.alert("컬렉션이 성공적으로 삭제되었습니다."); // 삭제 시 alert 유지
        } catch (err: any) {
            console.error("컬렉션 삭제 중 오류 발생:", err);
            const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
            window.alert(`컬렉션 삭제에 실패했습니다: ${errorMessage}`);
        }
    };

    const handleViewDetails = (collectionId: string) => {
        const foundCollection = collections.find(col => String(col.collectionId) === collectionId);

        if (foundCollection) {
            setSelectedCollection(foundCollection);
            setShowDetailModal(true);
        } else {
            window.alert("컬렉션 정보를 찾을 수 없습니다.");
            console.warn("Collection not found in state:", collectionId);
        }
    };

    const handleItemDeleteFromCollection = async (collectionId: number, itemId: number) => {
        try {
            await deleteCollectionItem(collectionId, itemId);

            setCollections(prevCollections =>
                prevCollections.map(col =>
                    String(col.collectionId) === String(collectionId)
                        ? { ...col, items: col.items.filter(item => String(item.collectionItemId) !== String(itemId)) }
                        : col
                )
            );
            setSelectedCollection(prevSelected => {
                if (prevSelected && String(prevSelected.collectionId) === String(collectionId)) {
                    return { ...prevSelected, items: prevSelected.items.filter(item => String(item.collectionItemId) !== String(itemId)) };
                }
                return prevSelected;
            });
            window.alert("아이템이 성공적으로 삭제되었습니다."); // 아이템 삭제 시 alert 유지

        } catch (err: any) {
            if (err.message === 'Deletion cancelled by user.') {
                console.log('Item deletion cancelled by user.');
            } else {
                console.error("컬렉션 아이템 삭제 중 오류 발생:", err);
                if (err instanceof Error && err.message === 'Unauthorized') {
                    window.alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
                    router.push('/user/login');
                    return;
                }
                const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
                window.alert(`아이템 삭제에 실패했습니다: ${errorMessage}`);
            }
        }
    };

    const handleReorderItems = async (collectionId: string, newItems: CollectionItem[]): Promise<void> => {
        const itemsForUpdate = newItems.map((item, idx) => ({
            id: item.collectionItemId,
            ...item,
            itemOrder: idx
        }));

        try {
            await updateCollectionItemsFull(collectionId, itemsForUpdate);
            console.log("아이템 순서가 성공적으로 저장되었습니다.");
            // 아이템 순서 변경 후에도 컬렉션 데이터 새로고침
            const updatedCollections = await fetchPublicCollections();
            setCollections(updatedCollections);
            // 상세 모달이 열려 있다면, 해당 컬렉션의 아이템 목록도 업데이트
            setSelectedCollection(prevSelected => {
                if (prevSelected && String(prevSelected.collectionId) === collectionId) {
                    return { ...prevSelected, items: newItems };
                }
                return prevSelected;
            });
            setCollectionIdToShowReorderMessage(collectionId);
            // window.alert('아이템 순서가 성공적으로 저장되었습니다!'); // 순서 변경 성공 메시지 추가
        } catch (error) {
            console.error("아이템 순서 저장 중 오류 발생:", error);
            window.alert('아이템 순서 저장에 실패했습니다. 다시 시도해주세요.');
            throw error;
        }
    };

    const handleReorderMessageShown = useCallback(() => {
        setCollectionIdToShowReorderMessage(null); // 메시지 표시 완료 후 ID 초기화
    }, []);

    const handleCloseDetailModal = (updatedCollection?: Collection) => {
        setShowDetailModal(false);
        setSelectedCollection(null);

        if (updatedCollection) {
            setCollections(prevCollections =>
                prevCollections.map(col =>
                    String(col.collectionId) === String(updatedCollection.collectionId) ? updatedCollection : col
                )
            );
        }
    };

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">공개 컬렉션</h1>
                <div className="flex space-x-4">
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                        onClick={() => {
                            router.push('/collections');
                        }}
                    >
                        나의 컬렉션으로
                    </button>
                    
                </div>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">로딩 중...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {!loading && !error && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <AnimatePresence>
                        {collections.map((col) => (
                            <motion.div
                                key={String(col.collectionId)}
                                variants={cardVariants}
                                layout
                            >
                                <CollectionCard
                                    collection={col}
                                    onViewDetails={() => handleViewDetails(String(col.collectionId))}
                                    // onEdit={handleEditCollection}
                                    // onDelete={handleDeleteCollection}
                                    showEditSuccessMessage={collectionIdToShowEditMessage === String(col.collectionId)}
                                    onEditMessageShown={handleEditMessageShown}
                                    showReorderSuccessMessage={collectionIdToShowReorderMessage === String(col.collectionId)}
                                    onReorderMessageShown={handleReorderMessageShown} 
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            <CollectionDetailModal
                isOpen={showDetailModal}
                onClose={handleCloseModal}
                collection={selectedCollection}
                onCopyCollection={handleCopyCollection}
                // 공유 페이지에서는 onDeleteItem,reorder 안보냄
                
            />
        </motion.div>
    );
}