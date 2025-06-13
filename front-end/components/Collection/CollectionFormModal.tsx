// components/CollectionFormModal.tsx
import React, { useState, useEffect } from 'react';
import type { Collection } from '@/types/collection';

interface CollectionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingCollection: Collection | null;
    onSubmit: (
        name: string,
        description: string,
        isPublic: boolean,
        collectionId?: string
    ) => Promise<void>;
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({
    isOpen,
    onClose,
    editingCollection,
    onSubmit,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        if (editingCollection) {
            setName(editingCollection.name);
            setDescription(editingCollection.description || '');
            setIsPublic(editingCollection.isPublic);
        } else {
            // 새 컬렉션 생성 시 초기화
            setName('');
            setDescription('');
            setIsPublic(false);
        }
    }, [editingCollection, isOpen]); // isOpen이 변경될 때도 초기화

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await onSubmit(name, description, isPublic, editingCollection?.collectionId);
        // 제출 후 폼 초기화는 부모 컴포넌트에서 모달 닫기 로직에 포함될 수 있습니다.
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-4">
                    {editingCollection ? '컬렉션 수정' : '새 컬렉션 만들기'}
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">
                        컬렉션 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        className="w-full border rounded px-3 py-2"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 나만의 활동, 음악 플레이리스트 등"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">설명</label>
                    <textarea
                        name="description"
                        className="w-full border rounded px-3 py-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="컬렉션에 대한 설명 (선택)"
                    />
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        className="accent-indigo-600"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <label htmlFor="isPublic" className="text-gray-700">
                        공개 컬렉션으로 설정
                    </label>
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CollectionFormModal;