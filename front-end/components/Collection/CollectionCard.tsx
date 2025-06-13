// components/Collection/CollectionCard.tsx
import React, { useState, useEffect } from 'react'; // useEffect 임포트 추가
import type { Collection } from '@/types/collection';
import { Music, Activity, Book, Share2 } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';

interface CollectionCardProps {
    collection: Collection;
    onViewDetails: (collectionId: string) => void;
    onEdit: (collection: Collection) => void;
    onDelete: (collectionId: string) => void;
    // ⭐ 새 props 추가: 수정 완료 메시지 트리거 ⭐
    showEditSuccessMessage: boolean;
    onEditMessageShown: () => void; // 메시지가 표시된 후 호출될 콜백
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    onViewDetails,
    onEdit,
    onDelete,
    showEditSuccessMessage, // 새 props
    onEditMessageShown,     // 새 props
}) => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    // ⭐ 상태 추가: 수정 메시지 표시 여부 ⭐
    const [showEditMessage, setShowEditMessage] = useState(false);

    // 공유 링크 복사 핸들러 (기존 로직 유지)
    const handleCopyShareLink = () => {
        const shareLink = `${window.location.origin}/collections/share/${collection.collectionId}`;
        navigator.clipboard.writeText(shareLink);

        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 1500); // 1.5초 후 메시지 사라짐 (애니메이션 시간 고려)
    };

    // ⭐ useEffect를 사용하여 showEditSuccessMessage props 변화 감지 ⭐
    useEffect(() => {
        if (showEditSuccessMessage) {
            setShowEditMessage(true);
            const timer = setTimeout(() => {
                setShowEditMessage(false);
                onEditMessageShown(); // 메시지가 사라진 후 부모에게 알림
            }, 1500);
            return () => clearTimeout(timer); // 클린업 함수
        }
    }, [showEditSuccessMessage, onEditMessageShown]);

    return (
        <motion.div
            className="bg-white rounded-xl shadow p-6 flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
            <div className="flex-1 min-h-[70px]">
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
            <div className="flex gap-2 mt-4 relative">
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
                {/* ⭐ 수정 완료 메시지 (수정 버튼 위) ⭐ */}
                <AnimatePresence>
                    {showEditMessage && (
                        <motion.span
                            key="edit-message"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -20 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{
                                opacity: { duration: 0.3, ease: "easeOut" },
                                y: { duration: 0.5, ease: "easeOut" }
                            }}
                            className="absolute bottom-full mb-2 whitespace-nowrap
                                       bg-gray-800 text-white text-xs rounded px-2 py-1
                                       pointer-events-none z-10" // left 값 조정 필요
                        >
                            수정되었습니다!
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => onDelete(String(collection.collectionId))}
                >
                    삭제
                </button>
                {collection.isPublic && (
                    <div className="ml-auto relative">
                        <button
                            className="text-blue-500 hover:underline text-sm"
                            onClick={handleCopyShareLink}
                        >
                            <Share2 />
                        </button>
                        <AnimatePresence>
                            {showCopiedMessage && (
                                <motion.span
                                    key="copied-message"
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: -20 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{
                                        opacity: { duration: 0.3, ease: "easeOut" },
                                        y: { duration: 0.5, ease: "easeOut" }
                                    }}
                                    className="absolute bottom-full right-0 mb-2 whitespace-nowrap
                                               bg-gray-800 text-white text-xs rounded px-2 py-1
                                               pointer-events-none z-10"
                                >
                                    복사되었습니다!
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CollectionCard;