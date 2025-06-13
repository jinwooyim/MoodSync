// components/Collection/CollectionCard.tsx
import React from 'react';
import type { Collection } from '@/types/collection';
import { Music, Activity , Book,Share2  } from "lucide-react"
import { motion } from 'framer-motion'; // ⭐ Framer Motion 임포트 ⭐

interface CollectionCardProps {
    collection: Collection;
    onViewDetails: (collectionId: string) => void;
    onEdit: (collection: Collection) => void;
    onDelete: (collectionId: string) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    onViewDetails,
    onEdit,
    onDelete,
}) => {
    // 공유 링크 복사 핸들러 (기존 로직 유지)
    const handleCopyShareLink = () => {
        const shareLink = `${window.location.origin}/collections/share/${collection.collectionId}`;
        navigator.clipboard.writeText(shareLink);
        window.alert('공유 링크가 클립보드에 복사되었습니다.');
    };

    return (
        // ⭐ 최상위 div에 motion.div 및 whileHover 애니메이션 추가 ⭐
        <motion.div 
            className="bg-white rounded-xl shadow p-6 flex flex-col"
            whileHover={{ scale: 1.02 }} // 마우스 올렸을 때 1.02배 커지도록
            transition={{ type: "spring", stiffness: 400, damping: 20 }} // 부드러운 스프링 애니메이션 효과
        >
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{collection.name}</h2>
                <span
                    className={`text-xs px-2 py-1 rounded ${
                        collection.isPublic
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {collection.isPublic ? '공개' : '비공개'}
                </span>
            </div>
            <p className="text-gray-600 mb-4">{collection.description}</p>
            <div className="flex-1 min-h-[70px]"> {/* 최소 높이 유지 */}
                <div className="flex flex-wrap gap-2">
                    {collection.items && collection.items.length > 0 ? (
                        <>
                            {collection.items.slice(0, 3).map((item) => (
                                <div
                                    key={item.collectionItemId}
                                    className="bg-indigo-50 rounded px-2 py-1 text-sm text-indigo-700 flex items-center gap-1"
                                >
                                    <span className="font-bold">
                                        {item.contentType === 'music' && <Music className="w-4 h-4" />}
                                        {item.contentType === 'activity' && <Activity className="w-4 h-4" />}
                                        {item.contentType === 'book' && <Book className="w-4 h-4" />}
                                    </span>
                                    <span>{item.contentTitle}</span>
                                </div>
                            ))}
                            {collection.items.length > 3 && (
                                <span className="text-xs text-gray-400">
                                    +{collection.items.length - 3}개 더 있음
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">아이템이 없습니다.</span>
                    )}
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    className="text-indigo-600 hover:underline text-sm"
                    onClick={() => onViewDetails(String(collection.collectionId))}
                >
                    상세보기
                </button>
                <button
                    className="text-gray-500 hover:underline text-sm"
                    onClick={() => onEdit(collection)}
                >
                    수정
                </button>
                <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => onDelete(String(collection.collectionId))}
                >
                    삭제
                </button>
                {collection.isPublic && (
                    <button
                        className="ml-auto text-blue-500 hover:underline text-sm"
                        onClick={handleCopyShareLink}
                    >
                        <Share2 />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default CollectionCard;
