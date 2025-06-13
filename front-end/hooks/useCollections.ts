// lib/hooks/useCollections.ts
import { useState, useEffect, useCallback } from "react";
import type { Collection } from "@/types/collection";
import { fetchCollections } from "@/lib/api/collections";
import { useRouter } from "next/navigation"; // useRouter도 필요

interface UseCollectionsResult {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  refetchCollections: () => Promise<void>; // 데이터를 다시 불러올 함수
}

export const useCollections = (): UseCollectionsResult => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError(null); // 새로운 로드 시 에러 초기화
    try {
      const fetchedCollections = await fetchCollections();
      setCollections(fetchedCollections);
    } catch (e) {
      if (e instanceof Error && e.message === 'Unauthorized') {
        // alert 대신 커스텀 모달 사용 권장
        window.alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/user/login');
      } else {
        console.error("Failed to fetch collections:", e);
        setError("컬렉션 목록을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]); // loadCollections는 useCallback으로 메모이제이션되었으므로 안전

  // 외부에서 데이터를 다시 불러올 수 있도록 함수 제공
  const refetchCollections = useCallback(async () => {
    await loadCollections();
  }, [loadCollections]);

  return { collections, loading, error, refetchCollections };
};