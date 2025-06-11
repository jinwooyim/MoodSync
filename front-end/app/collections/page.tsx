// CollectionPage.tsx

"use client";

import { useState, useEffect } from "react"; // useContext는 사용하지 않으므로 제거
import type { Collection, CollectionItem } from "@/types/collection";
import { fetchCollections, createCollection, updateCollection, deleteCollection } from "@/lib/api/collections";
// import { AuthContext } from '@/contexts/AuthContext'; // 예시: AuthContext를 사용하여 토큰 정보 가져오기

export default function CollectionPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    useEffect(() => {
        const loadCollections = async () => {
            setLoading(true);
            try {
                const fetchedCollections = await fetchCollections();
                setCollections(fetchedCollections);
            } catch (e) {
                setError("컬렉션 목록을 불러오지 못했습니다.");
                console.error("Failed to fetch collections:", e); // 디버깅을 위해 콘솔 로그 추가
            } finally {
                setLoading(false);
            }
        };
        loadCollections();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const isPublic = formData.get("isPublic") === "on";

        try {
            if (editingCollection) {
                const collectionIdAsNumber = Number(editingCollection.id);
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

            setShowModal(false);
            setEditingCollection(null);
            // 작업 후 컬렉션 목록을 새로고침
            const newCollections = await fetchCollections();
            setCollections(newCollections);
        } catch (err: any) {
            console.error("API 호출 중 오류 발생:", err);
            // 에러 메시지를 사용자에게 더 친화적으로 표시
            const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
            alert(`작업에 실패했습니다: ${errorMessage}`);
        }
    };

    // --- 삭제 핸들러 추가 ---
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
            // 삭제 후 컬렉션 목록에서 해당 항목 제거 또는 전체 새로고침
            setCollections(prevCollections =>
                prevCollections.filter(col => col.id !== collectionId)
            );
        } catch (err: any) {
            console.error("컬렉션 삭제 중 오류 발생:", err);
            const errorMessage = err.response?.data?.message || err.message || '알 수 없는 오류';
            alert(`컬렉션 삭제에 실패했습니다: ${errorMessage}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">나의 컬렉션</h1>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
                    onClick={() => {
                        setShowModal(true);
                        setEditingCollection(null);
                    }}
                >
                    + 새 컬렉션 만들기
                </button>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">로딩 중...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}

            {/* 컬렉션 목록 */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((col) => (
                        <div key={col.id} className="bg-white rounded-xl shadow p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold">{col.name}</h2>
                                <span
                                    className={`text-xs px-2 py-1 rounded ${
                                        col.isPublic
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {col.isPublic ? "공개" : "비공개"}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{col.description}</p>
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2">
                                    {/* 기존 아이템 렌더링 로직 유지 */}
                                    {col.items && col.items.length > 0 ? ( // items가 undefined나 null일 경우를 대비
                                        <>
                                            {col.items.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-indigo-50 rounded px-2 py-1 text-sm text-indigo-700 flex items-center gap-1"
                                                >
                                                    <span className="font-bold">
                                                        {item.type === "music" && "🎵"}
                                                        {item.type === "activity" && "🏃"}
                                                        {item.type === "book" && "📚"}
                                                    </span>
                                                    <span>
                                                        {item.type === "music" && item.title}
                                                        {item.type === "activity" && item.activity}
                                                        {item.type === "book" && item.title}
                                                    </span>
                                                    {item.type === "music" && "artist" in item && (
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            {item.artist}
                                                        </span>
                                                    )}
                                                    {item.type === "activity" && "type" in item && (
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            {item.type}
                                                        </span>
                                                    )}
                                                    {item.type === "book" && "author" in item && (
                                                        <span className="ml-1 text-xs text-gray-500">
                                                            {item.author}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {col.items.length > 3 && (
                                                <span className="text-xs text-gray-400">
                                                    +{col.items.length - 3}개 더 있음
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
                                    onClick={() => alert("컬렉션 상세로 이동")}
                                >
                                    상세보기
                                </button>
                                <button
                                    className="text-gray-500 hover:underline text-sm"
                                    onClick={() => {
                                        console.log("수정 버튼 클릭 - 컬렉션 ID:", col.id);
                                        setEditingCollection(col);
                                        setShowModal(true);
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    className="text-red-500 hover:underline text-sm"
                                    onClick={() => handleDeleteCollection(col.id)} 
                                >
                                    삭제
                                </button>
                                {col.isPublic && (
                                    <button
                                        className="ml-auto text-blue-500 hover:underline text-sm"
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/share/collection/${col.id}`
                                            )
                                        }
                                    >
                                        공유 링크 복사
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 컬렉션 생성/수정 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <form
                        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            {editingCollection ? "컬렉션 수정" : "새 컬렉션 만들기"}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">
                                컬렉션 이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                className="w-full border rounded px-3 py-2"
                                required
                                defaultValue={editingCollection?.name || ""}
                                placeholder="예: 나만의 활동, 음악 플레이리스트 등"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">설명</label>
                            <textarea
                                name="description"
                                className="w-full border rounded px-3 py-2"
                                defaultValue={editingCollection?.description || ""}
                                placeholder="컬렉션에 대한 설명 (선택)"
                            />
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                className="accent-indigo-600"
                                defaultChecked={editingCollection?.isPublic || false}
                            />
                            <label htmlFor="isPublic" className="text-gray-700">
                                공개 컬렉션으로 설정
                            </label>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingCollection(null);
                                }}
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
            )}
        </div>
    );
}