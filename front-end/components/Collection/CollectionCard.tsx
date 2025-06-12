// components/CollectionCard.tsx
import React from 'react';
import type { Collection } from '@/types/collection';
import { Music, Activity , Book } from "lucide-react"

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
    // 공유 링크 복사 핸들러
    const handleCopyShareLink = () => {
        const shareLink = `${window.location.origin}/share/collection/${collection.id}`;
        navigator.clipboard.writeText(shareLink);
        alert('공유 링크가 클립보드에 복사되었습니다.');
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
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
            <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                    {collection.items && collection.items.length > 0 ? (
                        <>
                            {collection.items.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
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
                    onClick={() => onViewDetails(collection.id)}
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
                    onClick={() => onDelete(collection.id)}
                >
                    삭제
                </button>
                {collection.isPublic && (
                    <button
                        className="ml-auto text-blue-500 hover:underline text-sm"
                        onClick={handleCopyShareLink}
                    >
                        공유 링크 복사
                    </button>
                )}
            </div>
        </div>
    );
};

export default CollectionCard;