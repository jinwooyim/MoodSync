"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, CheckSquare, Book } from "lucide-react"

import { useState } from "react"
// @/types에서 MusicRecommendation, ActivityRecommendation, BookRecommendation, RecommendationResult 임포트
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types"
import { emotions } from "@/data/emotions"

// API 호출 함수 임포트
import { addToCollection,addCollectionItemToSelectedCollection } from "@/lib/api/collections";
import MusicRecommendationCard from "@/components/recommendation/MusicRecommendationCard";
import ActivityRecommendationCard from "@/components/recommendation/ActivityRecommendationCard";
import BookRecommendationCard from "@/components/recommendation/BookRecommendationCard";

import { useRouter } from 'next/navigation';

// 모달 컴포넌트 임포트
import CollectionSelectModal from "@/components/Collection/CollectionSelectModal";
// @/types/collection 에서 Collection 타입 임포트
import type { Collection } from "@/types/collection";

// 컬렉션 아이템 추가를 위한 payload 타입 정의
// 이 타입은 백엔드의 CollectionItemDTO와 일치해야 합니다.
interface CollectionItemPayload {
  collectionId: number;
  contentType: "music" | "activity" | "book";
  contentTitle: string; // 음악의 title, 활동의 activity, 책의 title
  contentDetails: any; // 원본 아이템 객체 전체 또는 필요한 세부 정보 (JSON 문자열 등으로 저장 가능)
}

interface RecommendationListProps {
  musicRecommendations: MusicRecommendation[]
  activityRecommendations: ActivityRecommendation[]
  bookRecommendations: BookRecommendation[]
  recommendationEmotionId: string | null
  recommendationDirty?: boolean
  youtubeVideos?: {
    videoUrl: string;
    thumbnail: string;
    title: string;
    channel: string;
  }[]  // 유튜브 영상 배열 추가 (optional)
}

export default function RecommendationList({
  musicRecommendations,
  activityRecommendations,
  bookRecommendations,
  recommendationEmotionId,
  recommendationDirty = false,
  youtubeVideos = [], // 추가
}: RecommendationListProps) {
  const [recommendationType, setRecommendationType] = useState<"music" | "activity" | "book">("music")
  const router = useRouter()

  // --- 모달 관련 상태 추가 ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCollections, setUserCollections] = useState<Collection[]>([]); // Collection[] 타입 사용
  const [currentItemToAdd, setCurrentItemToAdd] = useState<MusicRecommendation | ActivityRecommendation | BookRecommendation | null>(null);
  const [currentItemType, setCurrentItemType] = useState<"music" | "activity" | "book" | null>(null);

  const emotionUsedForDisplay = emotions.find((e) => e.id === recommendationEmotionId)

  if (!emotionUsedForDisplay) {
    return null
  }

  // 첫 번째 API 호출: 사용자 컬렉션 목록 가져오기 (모달을 띄우기 위함)
  const handleAddToCollection = async (
    item: MusicRecommendation | ActivityRecommendation | BookRecommendation,
    type: "music" | "activity" | "book"
  ) => {
    try {
      // payload에는 아이템 정보가 담겨있지만, 서버는 이 단계에서 컬렉션 목록을 반환합니다.
      const payload = { type, item };
      // /api/add-to-collection 엔드포인트는 이제 컬렉션 목록을 반환합니다.
      const collections: Collection[] = await addToCollection(payload); // 반환 타입이 Collection[]임을 명시

      setUserCollections(collections); // 받아온 컬렉션 목록 상태 업데이트
      setCurrentItemToAdd(item);       // 추가할 아이템 정보 저장
      setCurrentItemType(type);        // 추가할 아이템 타입 저장
      setIsModalOpen(true);            // 모달 열기

      console.log('사용자 컬렉션 목록을 성공적으로 불러왔습니다:', collections);
    } catch (error) {
      console.error('컬렉션 목록 조회 중 오류 발생:', error);
      if (error instanceof Error && error.message === 'Unauthorized') {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/user/login');
      } else {
        alert('컬렉션 목록을 불러오는 데 실패했습니다.');
      }
    }
  };

  // 두 번째 API 호출: 실제로 아이템을 특정 컬렉션에 추가
  // 이 함수는 모달에서 컬렉션이 선택되었을 때 호출됩니다.
  const handleConfirmAddToSelectedCollection = async (
    collectionId: number, // Collection 타입의 id가 number이므로 여기에 맞춤
    item: MusicRecommendation | ActivityRecommendation | BookRecommendation,
    type: "music" | "activity" | "book"
  ) => {
    try {
      // 아이템의 제목을 가져오는 헬퍼 함수
      const getItemTitle = (selectedItem: MusicRecommendation | ActivityRecommendation | BookRecommendation) => {
        if ('title' in selectedItem) {
          return selectedItem.title;
        } else if ('activity' in selectedItem) {
          return selectedItem.activity;
        }
        return '알 수 없는 항목'; // 안전을 위한 기본값
      };

      const contentTitle = getItemTitle(item);

      const addPayload: CollectionItemPayload = {
        collectionId: collectionId,
        contentType: type,
        contentTitle: contentTitle,
        contentDetails: item, // 원본 아이템 객체 전체를 JSON stringify하여 저장하거나, 필요한 필드만 추출
      };
      // 실제 아이템을 컬렉션에 추가하는 API 엔드포인트 호출
      const response = await addCollectionItemToSelectedCollection(addPayload);

      alert(`'${contentTitle}'(을)를 컬렉션에 성공적으로 추가했습니다!`);
      console.log('아이템 컬렉션 추가 응답:', response);

      setIsModalOpen(false);
      setCurrentItemToAdd(null);
      setCurrentItemType(null);

    } catch (error) {
      console.error('컬렉션에 아이템 추가 중 오류 발생:', error);
      // 로그인 오류 처리 (인터셉터에서 이미 처리되지만, 명시적으로 한 번 더)
      if (error instanceof Error && error.message === 'Unauthorized') {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        router.push('/user/login');
      } else {
        alert('컬렉션에 아이템 추가에 실패했습니다.');
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="mb-8"></div>
        {recommendationDirty ? (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 transition-colors duration-300">
            감정 값이 변경되었습니다! 다시 감정 분석을 해주세요!
          </Badge>
        ) : (
          <Badge
            className={`${emotionUsedForDisplay.color} transition-colors duration-300 dark:bg-gray-600 dark:text-gray-200`}
          >
            추천 기준 감정: {emotionUsedForDisplay.name}
          </Badge>
        )}
      </div>

      <Tabs
        value={recommendationType}
        onValueChange={(value) => setRecommendationType(value as "music" | "activity" | "book")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-muted dark:bg-gray-700 transition-colors duration-300">
          <TabsTrigger
            value="music"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Music className="w-4 h-4" />
            음악 추천
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <CheckSquare className="w-4 h-4" />
            활동 추천
          </TabsTrigger>
          <TabsTrigger
            value="book"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Book className="w-4 h-4" />
            도서 추천
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicRecommendations.map((music, index) => (
              <MusicRecommendationCard
                key={index}
                music={music}
                onAddToCollection={handleAddToCollection}
                youtubeVideos={youtubeVideos[index] ? [youtubeVideos[index]] : []}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activityRecommendations.map((activity, index) => (
              <ActivityRecommendationCard
                key={index}
                activity={activity}
                onAddToCollection={handleAddToCollection}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookRecommendations.map((book, index) => (
              <BookRecommendationCard
                key={index}
                book={book}
                onAddToCollection={handleAddToCollection}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 모달 컴포넌트 렌더링 */}
      <CollectionSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collections={userCollections}
        itemToAdd={currentItemToAdd}
        itemType={currentItemType}
        onSelectCollection={handleConfirmAddToSelectedCollection}
      />
    </div>
  )
}