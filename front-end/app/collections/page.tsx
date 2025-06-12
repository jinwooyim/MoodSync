// app/collection/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { Collection } from "@/types/collection";
import { fetchCollections, createCollection, updateCollection, deleteCollection } from "@/lib/api/collections";

import { useSearchParams, useRouter } from "next/navigation";

import CollectionCard from "@/components/Collection/CollectionCard";
import CollectionFormModal from "@/components/Collection/CollectionFormModal";
import CollectionDetailModal from "@/components/Collection/CollectionDetailModal";

export default function CollectionPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    // 컬렉션 생성/수정 모달 관련 상태
    const [showFormModal, setShowFormModal] = useState(false); // 이름을 showModal -> showFormModal로 변경
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    // 컬렉션 상세 보기 모달 관련 상태
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    
    // URL 에서 생성을 타고 온 경우에는 바로 생성 핸들러 실행 
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const fetchedCollections = await fetchCollections();
                setCollections(fetchedCollections);
                
                const action = searchParams?.get('action');
                if (action === 'create') {
                    setShowFormModal(true);
                    setEditingCollection(null); // 새 컬렉션 생성이므로 editingCollection은 null
                }
            } catch (e) {
                if (e instanceof Error && e.message === 'Unauthorized') {
                    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                    router.push('/user/login');
                    return;

                }
                // setError("컬렉션 목록을 불러오지 못했습니다.");
                // console.error("Failed to fetch collections:", e);
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, [searchParams]);

    // 컬렉션 생성/수정 제출 핸들러 (CollectionFormModal로 전달)
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
                    alert("수정할 컬렉션 ID가 유효하지 않습니다. 다시 시도해주세요.");
                    return;
                }
                await updateCollection({
                    collectionId: collectionIdAsNumber,
                    name,
                    description,
                    isPublic,
                });
                alert("컬렉션이 성공적으로 수정되었습니다.");
            } else {
                await createCollection({ name, description, isPublic });
                alert("컬렉션이 성공적으로 생성되었습니다.");
            }

            setShowFormModal(false); // 모달 닫기
            setEditingCollection(null); // 수정 중인 컬렉션 초기화
            const newCollections = await fetchCollections(); // 데이터 새로고침
            setCollections(newCollections);
        } catch (e: any) {
            console.error("API 호출 중 오류 발생:", e);
            if (e instanceof Error && e.message === 'Unauthorized') {
                alert('로그인이 만료되었습니다. 다시 로그인 해주세요.');
                router.push('/user/login');
                return;
            }
            const errorMessage = e.response?.data?.message || e.message || '알 수 없는 오류';
            alert(`작업에 실패했습니다: ${errorMessage}`);
        }
    };

    // 컬렉션 삭제 핸들러 (CollectionCard로 전달)
    const handleDeleteCollection = async (collectionId: string) => {
        if (!confirm("정말로 이 컬렉션을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const collectionIdAsNumber = Number(collectionId);
            if (isNaN(collectionIdAsNumber)) {
                alert("삭제할 컬렉션 ID가 유효하지 않습니다.");
                return;
            }

            await deleteCollection(collectionIdAsNumber);
            alert("컬렉션이 성공적으로 삭제되었습니다.");
            setCollections(prevCollections =>
                prevCollections.filter(col => col.id !== collectionId)
            );
        } catch (err: any) {
            console.error("컬렉션 삭제 중 오류 발생:", err);
            const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
            alert(`컬렉션 삭제에 실패했습니다: ${errorMessage}`);
        }
    };

    // 컬렉션 상세보기 핸들러 (CollectionCard로 전달)
    const handleViewDetails = (collectionId: string) => {
        const foundCollection = collections.find(col => col.id === collectionId);
        
        if (foundCollection) {
            setSelectedCollection(foundCollection);
            setShowDetailModal(true);
        } else {
            alert("컬렉션 정보를 찾을 수 없습니다.");
            console.warn("Collection not found in state:", collectionId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">나의 컬렉션</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                    onClick={() => {
                        setShowFormModal(true); // showModal -> showFormModal
                        setEditingCollection(null);
                    }}
                >
                    + 새 컬렉션 만들기
                </button>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">로딩 중...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <CollectionCard
                            key={col.id}
                            collection={col}
                            onViewDetails={handleViewDetails}
                            onEdit={(collectionToEdit) => {
                                setEditingCollection(collectionToEdit);
                                setShowFormModal(true); // showModal -> showFormModal
                            }}
                            onDelete={handleDeleteCollection}
                        />
                    ))}
                </div>
            )}

            {/* CollectionFormModal 컴포넌트 사용 */}
            <CollectionFormModal
                isOpen={showFormModal}
                onClose={() => {
                    setShowFormModal(false);
                    setEditingCollection(null);
                }}
                editingCollection={editingCollection}
                onSubmit={handleFormSubmit}
            />

            {/* CollectionDetailModal 컴포넌트 사용 */}
            <CollectionDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedCollection(null);
                }}
                collection={selectedCollection}
            />
        </div>
    );
}