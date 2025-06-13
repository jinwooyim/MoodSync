// components/Collection/CollectionCard.tsx
import React, { useState, useEffect } from 'react';
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
    onEditMessageShown: () => void;
    // ⭐ 새 props 추가: 아이템 순서 변경 완료 메시지 트리거 ⭐
    showReorderSuccessMessage: boolean; // 추가된 prop
    onReorderMessageShown: () => void;  // 추가된 prop
}

const CollectionCard: React.FC<CollectionCardProps> = ({
    collection,
    onViewDetails,
    onEdit,
    onDelete,
    showEditSuccessMessage,
    onEditMessageShown,
    showReorderSuccessMessage, // props로 받도록 추가
    onReorderMessageShown      // props로 받도록 추가
}) => {
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [showMessage, setShowMessage] = useState(false); // 단일 메시지 상태로 통합
    const [messageText, setMessageText] = useState(""); // 표시할 메시지 텍스트 상태

    // 공유 링크 복사 핸들러 (기존 로직 유지)
    const handleCopyShareLink = () => {
        const shareLink = `${window.location.origin}/collections/share/${collection.collectionId}`;
        navigator.clipboard.writeText(shareLink);

        setMessageText("링크가 복사되었습니다!");
        setShowMessage(true);
        const timer = setTimeout(() => {
            setShowMessage(false);
            setMessageText(""); // 메시지 숨김 후 텍스트 초기화
        }, 1500);
        return () => clearTimeout(timer);
    };

    // ⭐ useEffect를 사용하여 showEditSuccessMessage 및 showReorderSuccessMessage props 변화 감지 ⭐
    useEffect(() => {
        if (showEditSuccessMessage) {
            setMessageText("컬렉션이 성공적으로 수정되었습니다!");
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                setMessageText("");
                onEditMessageShown(); // 메시지가 사라진 후 부모에게 알림
            }, 1500);
            return () => clearTimeout(timer);
        } else if (showReorderSuccessMessage) { // 아이템 순서 변경 메시지 로직 추가
            setMessageText("아이템 순서가 성공적으로 저장되었습니다!");
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                setMessageText("");
                onReorderMessageShown(); // 메시지가 사라진 후 부모에게 알림
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showEditSuccessMessage, onEditMessageShown, showReorderSuccessMessage, onReorderMessageShown]); // 의존성 배열에 추가

    return (
        <motion.div
            className="bg-white rounded-xl shadow p-6 flex flex-col relative" // relative 추가
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
            {/* ⭐ 통합된 메시지 표시 부분 ⭐ */}
            <AnimatePresence>
                {showMessage && (
                    <motion.span
                        key={messageText} // 메시지 텍스트에 따라 key 변경 (동일 메시지 반복시 애니메이션 재실행)
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -20 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{
                            opacity: { duration: 0.3, ease: "easeOut" },
                            y: { duration: 0.5, ease: "easeOut" }
                        }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap
                                   bg-gray-800 text-white text-xs rounded px-2 py-1
                                   pointer-events-none z-10"
                    >
                        {messageText}
                    </motion.span>
                )}
            </AnimatePresence>

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
            <div className="flex gap-2 mt-4"> {/* relative 클래스는 motion.div로 옮김 */}
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
                    <div className="ml-auto"> {/* relative 클래스는 motion.div로 옮김 */}
                        <button
                            className="text-blue-500 hover:underline text-sm"
                            onClick={handleCopyShareLink}
                        >
                            <Share2 />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CollectionCard;