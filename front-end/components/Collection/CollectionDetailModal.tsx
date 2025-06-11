// components/CollectionDetailModal.tsx
import React from 'react';
import type { Collection } from '@/types/collection';
import { Music, CheckSquare, Book } from "lucide-react"

interface CollectionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection: Collection | null; // 상세 정보를 보여줄 컬렉션
}

const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
    isOpen,
    onClose,
    collection,
}) => {
    if (!isOpen || !collection) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {collection.name} 상세 아이템
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                        onClick={onClose}
                    >
                        &times; {/* 닫기 버튼 (X 아이콘) */}
                    </button>
                </div>

                <p className="text-gray-600 mb-4">{collection.description || '설명 없음'}</p>

                <h3 className="text-lg font-semibold mb-3 border-b pb-2">아이템 목록</h3>
                {collection.items && collection.items.length > 0 ? (
                    <ul className="space-y-3">
                        {collection.items.map((item) => (
                            <li key={item.id} className="bg-gray-50 p-3 rounded-md flex items-center gap-3">
                                <span className="text-xl">
                                    {item.contentType === 'music' && <Music className="w-4 h-4" />}
                                    {item.contentType === 'acting' && <CheckSquare className="w-4 h-4" />}
                                    {item.contentType === 'book' && <Book className="w-4 h-4" />}
                                </span>
                                <div className="flex-1">
                                    <p className="text-lg font-medium">{item.contentTitle}</p>
                                    <p className="text-sm text-gray-500">
                                        추가됨: {new Date(item.addedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailModal;