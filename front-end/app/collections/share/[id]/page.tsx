// app/collections/share/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { fetchCollection } from '@/lib/api/collections';
import type { Collection } from '@/types/collection'; // Collection 타입 임포트
import CollectionDetailModal from '@/components/Collection/CollectionDetailModal'; // ★ 모달 컴포넌트 임포트 ★

interface CollectionSharePageProps {
    params: {
        id: string;
    };
}

export default function CollectionSharePage({ params }: CollectionSharePageProps) {
    const { id: collectionId } = params;
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림 상태 관리

    useEffect(() => {
        const loadCollection = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedCollection: Collection = await fetchCollection(collectionId);

                if (fetchedCollection && fetchedCollection.isPublic) {
                    setCollection(fetchedCollection);
                    setIsModalOpen(true); // 데이터를 성공적으로 가져오면 모달 열기
                } else {
                    notFound(); 
                }
            } catch (err: any) {
                console.error("공유 컬렉션 정보 불러오기 실패:", err);
                setError("컬렉션 정보를 불러오지 못했습니다.");
                notFound(); 
            } finally {
                setLoading(false);
            }
        };

        if (collectionId) {
            loadCollection();
        }
    }, [collectionId]);

    // 모달 닫기 핸들러 (브라우저 뒤로 가기)
    const handleCloseModal = () => {
        setIsModalOpen(false); // 모달 상태 닫기
        window.history.back(); // 브라우저 뒤로 가기
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-600">로딩 중...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    // 데이터는 있지만 아직 모달이 열리지 않았다면 (초기 로딩 후) null 반환.
    // 보통은 isModalOpen이 true가 되어 모달이 바로 렌더링될 것입니다.
    if (!collection) {
        return null;
    }

    

    return (
        <>
            {/* CollectionDetailModal 컴포넌트 사용 */}
            <CollectionDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                collection={collection}
                // 공유 페이지에서는 onDeleteItem,reorder 안보냄
                
            />
        </>
    );
}