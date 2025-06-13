// app/collection/page.tsx
"use client";

import { useState, useEffect } from "react";
// Collection, CollectionItem 타입을 임포트합니다.
import type { Collection, CollectionItem } from "@/types/collection"; 
// API 호출 함수들을 임포트합니다.
import { fetchCollections, createCollection, updateCollection, deleteCollection, deleteCollectionItem, updateCollectionItemsFull } from "@/lib/api/collections";

import { useSearchParams, useRouter } from "next/navigation";

// 하위 컴포넌트 임포트
import CollectionCard from "@/components/Collection/CollectionCard";
import CollectionFormModal from "@/components/Collection/CollectionFormModal";
import CollectionDetailModal from "@/components/Collection/CollectionDetailModal";

export default function CollectionPage() {
    // 모든 컬렉션을 저장하는 상태
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // 컬렉션 생성/수정 모달 관련 상태
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    // 컬렉션 상세 보기 모달 관련 상태
    const [showDetailModal, setShowDetailModal] = useState(false);
    // 현재 상세 보기 모달에 표시될 컬렉션 객체
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    
    // 컴포넌트 마운트 시 또는 URL searchParams 변경 시 컬렉션 목록을 로드합니다.
    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const fetchedCollections = await fetchCollections();
                setCollections(fetchedCollections);
                
                // URL에 'action=create'가 있으면 새 컬렉션 생성 모달을 엽니다.
                const action = searchParams?.get('action');
                if (action === 'create') {
                    setShowFormModal(true);
                    setEditingCollection(null); // 새 컬렉션 생성이므로 editingCollection은 null
                }
            } catch (e) {
                // 인증 오류 처리
                if (e instanceof Error && e.message === 'Unauthorized') {
                    // alert 대신 커스텀 모달 사용 권장
                    window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                    router.push('/user/login');
                    return;
                }
                // 다른 오류 처리 (필요시 상세화)
                console.error("Failed to fetch collections:", e);
                // setError("컬렉션 목록을 불러오지 못했습니다."); // 사용자에게 보여줄 에러 메시지 설정
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, [searchParams, router]); // searchParams와 router를 의존성 배열에 추가

    // 컬렉션 생성/수정 제출 핸들러 (CollectionFormModal로 전달)
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
                    // alert 대신 커스텀 모달 사용 권장
                    window.alert("수정할 컬렉션 ID가 유효하지 않습니다. 다시 시도해주세요.");
                    return;
                }
                await updateCollection({
                    collectionId: collectionIdAsNumber,
                    name,
                    description,
                    isPublic,
                });
                // alert 대신 커스텀 모달 사용 권장
                window.alert("컬렉션이 성공적으로 수정되었습니다.");
            } else {
                // 새 컬렉션 생성
                await createCollection({ name, description, isPublic });
                // alert 대신 커스텀 모달 사용 권장
                window.alert("컬렉션이 성공적으로 생성되었습니다.");
            }

            setShowFormModal(false); // 모달 닫기
            setEditingCollection(null); // 수정 중인 컬렉션 초기화
            const newCollections = await fetchCollections(); // 데이터 새로고침
            setCollections(newCollections); // 컬렉션 목록 업데이트
        } catch (e: any) {
            console.error("API 호출 중 오류 발생:", e);
            // 인증 오류 처리
            if (e instanceof Error && e.message === 'Unauthorized') {
                // alert 대신 커스텀 모달 사용 권장
                window.alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
                router.push('/user/login');
                return;
            }
            // 일반 오류 메시지 표시
            const errorMessage = e.response?.data?.message || e.message || '알 수 없는 오류';
            // alert 대신 커스텀 모달 사용 권장
            window.alert(`작업에 실패했습니다: ${errorMessage}`);
        }
    };

    // 컬렉션 삭제 핸들러 (CollectionCard로 전달)
    const handleDeleteCollection = async (collectionId: string) => {
        // confirm 대신 커스텀 모달 사용 권장
        if (!window.confirm("정말로 이 컬렉션을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const collectionIdAsNumber = Number(collectionId);
            if (isNaN(collectionIdAsNumber)) {
                // alert 대신 커스텀 모달 사용 권장
                window.alert("삭제할 컬렉션 ID가 유효하지 않습니다.");
                return;
            }

            await deleteCollection(collectionIdAsNumber);
            // alert 대신 커스텀 모달 사용 권장
            window.alert("컬렉션이 성공적으로 삭제되었습니다.");
            // UI에서 즉시 삭제된 컬렉션 반영
            setCollections(prevCollections =>
                prevCollections.filter(col => String(col.collectionId) !== collectionId)
            );
        } catch (err: any) {
            console.error("컬렉션 삭제 중 오류 발생:", err);
            const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
            // alert 대신 커스텀 모달 사용 권장
            window.alert(`컬렉션 삭제에 실패했습니다: ${errorMessage}`);
        }
    };

    // 컬렉션 상세보기 핸들러 (CollectionCard로 전달)
    const handleViewDetails = (collectionId: string) => {
        // collections 상태에서 해당 ID의 컬렉션을 찾아 상세 모달에 표시
        const foundCollection = collections.find(col => String(col.collectionId) === collectionId);
        
        if (foundCollection) {
            setSelectedCollection(foundCollection);
            setShowDetailModal(true);
        } else {
            // alert 대신 커스텀 모달 사용 권장
            window.alert("컬렉션 정보를 찾을 수 없습니다.");
            console.warn("Collection not found in state:", collectionId);
        }
    };

    // 컬렉션 아이템 삭제 핸들러 (CollectionDetailModal로 전달)
    const handleItemDeleteFromCollection = async (collectionId: number, itemId: number) => {
        try {
            await deleteCollectionItem(collectionId, itemId); 
            
            // UI에서 즉시 컬렉션 목록과 선택된 컬렉션의 아이템 업데이트
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

        } catch (err: any) {
            // 사용자가 취소한 경우 (deleteCollectionItem에서 throw한 에러)는 특별히 처리하지 않음
            if (err.message === 'Deletion cancelled by user.') {
                console.log('Item deletion cancelled by user.');
            } else {
                console.error("컬렉션 아이템 삭제 중 오류 발생:", err);
                if (err instanceof Error  && err.message === 'Unauthorized') {
                    // alert 대신 커스텀 모달 사용 권장
                    window.alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
                    router.push('/user/login');
                    return;
                }
                const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
                // alert 대신 커스텀 모달 사용 권장
                window.alert(`아이템 삭제에 실패했습니다: ${errorMessage}`);
            }
        }
    };

    // 컬렉션 아이템 순서 변경 핸들러 (CollectionDetailModal로 전달)
    // 이 함수는 Promise<void>를 반환해야 합니다.
    const handleReorderItems = async (collectionId: string, newItems: CollectionItem[]): Promise<void> => {
        // CollectionItem 배열을 그대로 사용하여 API 호출
        const itemsForUpdate = newItems.map((item, idx) => ({
            id: item.collectionItemId, // Add the id property
            ...item,          // 기존 아이템 데이터 모두 포함
            itemOrder: idx    // 새로운 순서로 itemOrder 업데이트
        }));

        try {
            // API 호출 (DB에 순서 저장)
            await updateCollectionItemsFull(collectionId, itemsForUpdate);
            console.log("아이템 순서가 성공적으로 저장되었습니다.");
            // alert("아이템 순서가 성공적으로 저장되었습니다."); // CollectionDetailModal에서 alert하도록 변경했으므로 주석 처리

            // ⭐ 중요: selectedCollection 상태를 여기서 업데이트하지 않습니다.
            //    이전 로직에서는 여기서 selectedCollection을 업데이트했지만,
            //    이제 CollectionDetailModal의 onClose에서 최종 업데이트된 collection을 받아 처리할 것이므로,
            //    여기서는 DB 저장만 성공적으로 마치면 됩니다.
            //    CollectionDetailModal은 `items` 상태를 직접 업데이트하므로, 모달 내 UI는 이미 변경된 상태입니다.

        } catch (error) {
            console.error("아이템 순서 저장 중 오류 발생:", error);
            // alert 대신 커스텀 모달 사용 권장
            window.alert('아이템 순서 저장에 실패했습니다. 다시 시도해주세요.');
            throw error; // 에러를 CollectionDetailModal로 다시 던져서 처리하도록
        }
    };
    
    // ⭐ CollectionDetailModal의 onClose 핸들러
    // 모달이 닫힐 때, updatedCollection이 전달되면 collections 상태를 업데이트합니다.
    const handleCloseDetailModal = (updatedCollection?: Collection) => {
        setShowDetailModal(false); // 상세 모달 닫기
        setSelectedCollection(null); // 선택된 컬렉션 초기화

        // updatedCollection이 인자로 전달된 경우 (즉, 저장 후 모달 닫기)
        if (updatedCollection) {
            // collections 배열에서 해당 컬렉션을 찾아 업데이트된 데이터로 교체합니다.
            setCollections(prevCollections => 
                prevCollections.map(col => 
                    String(col.collectionId) === String(updatedCollection.collectionId) ? updatedCollection : col
                )
            );
        } else {
            // 변경 사항 없이 닫거나, 취소된 경우:
            // 필요하다면, 전체 컬렉션을 다시 불러와서 최신 상태를 반영할 수 있습니다.
            // (예: 삭제 후 바로 모달이 닫히는 경우. 이미 handleItemDeleteFromCollection에서 처리하고 있으므로 불필요)
            // fetchCollections(); // 이 방법은 API 호출이 한 번 더 발생하므로, 위에 직접 상태를 업데이트하는 것이 더 효율적입니다.
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">나의 컬렉션</h1>
                <div className="flex space-x-4">
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                        onClick={() => {
                            router.push('/collections/modify');
                        }}
                    >
                        수정 모드
                    </button>
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                        onClick={() => {
                            setShowFormModal(true);
                            setEditingCollection(null);
                        }}
                    >
                        + 새 컬렉션 만들기
                    </button>
                </div>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">로딩 중...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <CollectionCard
                            key={String(col.collectionId)} // key는 string이어야 합니다.
                            collection={col}
                            onViewDetails={() => handleViewDetails(String(col.collectionId))}
                            onEdit={(collectionToEdit) => {
                                setEditingCollection(collectionToEdit);
                                setShowFormModal(true);
                            }}
                            onDelete={handleDeleteCollection}
                        />
                    ))}
                </div>
            )}

            {/* 컬렉션 생성/수정 모달 */}
            <CollectionFormModal
                isOpen={showFormModal}
                onClose={() => {
                    setShowFormModal(false);
                    setEditingCollection(null);
                }}
                editingCollection={editingCollection}
                onSubmit={handleFormSubmit}
            />

            {/* 컬렉션 상세 보기 및 아이템 관리 모달 */}
            <CollectionDetailModal
                isOpen={showDetailModal}
                onClose={handleCloseDetailModal} // ⭐ 수정된 onClose 핸들러 전달
                collection={selectedCollection}
                onDeleteItem={(collectionIdStr, itemId) => handleItemDeleteFromCollection(Number(collectionIdStr), Number(itemId))} 
                onReorderItems={handleReorderItems} // ⭐ Promise<void>를 반환하는 함수 전달
            />
        </div>
    );
}
