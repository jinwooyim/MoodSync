'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type ModelStatus = {
  act_model: boolean | null;
  book_model: boolean | null;
  music_model: boolean | null;
};

export default function ModelStatusGrid() {
  const [status, setStatus] = useState<ModelStatus>({
    act_model: null,
    book_model: null,
    music_model: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get<ModelStatus>('http://localhost:4000/model-status');
        setStatus(response.data);
      } catch (err) {
        console.error('모델 상태 불러오기 실패', err);
      }
    };

    // 처음에 한 번 호출
    fetchStatus();

    // 이후 5초마다 호출
    const intervalId = setInterval(fetchStatus, 5000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  const renderCard = (title: string, folder: string, isActive: boolean | null) => (
    <div className="border rounded-2xl shadow p-4 space-y-3 bg-white">
      <div className="text-sm font-semibold">{title}</div>
      <div className="flex justify-between text-sm text-gray-700">
        <span>파일:</span>
        <span>{folder}/</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>상태:</span>
        <span className={isActive ? 'text-green-600' : 'text-red-600'}>
          {isActive === null ? '로딩 중...' : isActive ? '활성' : '비활성'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {renderCard('활동 추천 모델', 'act_model', status.act_model)}
      {renderCard('도서 추천 모델', 'book_model', status.book_model)}
      {renderCard('음악 추천 모델', 'music_model', status.music_model)}
    </div>
  );
}
