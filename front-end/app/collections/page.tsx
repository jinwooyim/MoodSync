"use client";

import { useState, useEffect } from "react";
import type { Collection, CollectionItem } from "@/types/collection";
import { fetchCollections, createCollection } from "@/lib/api/collections";

export default function CollectionPage() {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

	useEffect(() => {
		setLoading(true);
		fetchCollections()
			.then(setCollections)
			.catch((e) => setError("컬렉션 목록을 불러오지 못했습니다."))
			.finally(() => setLoading(false));
	}, []);

	// 컬렉션 생성/수정 폼 제출 핸들러 (임시)
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const isPublic = formData.get("isPublic") === "on";
		try {
			await createCollection({ name, description, isPublic });
			setShowModal(false);
			setEditingCollection(null);
			setLoading(true);
			const newCollections = await fetchCollections();
			setCollections(newCollections);
		} catch (err) {
			alert("컬렉션 생성에 실패했습니다.");
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
									{col.items.slice(0, 3).map((item) => (
										<div
											key={item.id}
											className="bg-indigo-50 rounded px-2 py-1 text-sm text-indigo-700 flex items-center gap-1"
										>
											{/* 타입별로 아이콘/출력 다르게 */}
											<span className="font-bold">
												{item.type === "music" && "🎵"}
												{item.type === "activity" && "🏃"}
												{item.type === "book" && "📚"}
											</span>
											{/* 타입별로 대표 텍스트 분기 */}
											<span>
												{item.type === "music" && item.title}
												{item.type === "activity" && item.activity}
												{item.type === "book" && item.title}
											</span>
											{/* 음악이면 아티스트, 활동이면 타입, 도서면 저자 등 부가정보 */}
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
										setEditingCollection(col);
										setShowModal(true);
									}}
								>
									수정
								</button>
								<button
									className="text-red-500 hover:underline text-sm"
									onClick={() => alert("삭제 확인 모달")}
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
