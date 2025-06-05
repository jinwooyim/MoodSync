
interface UserRecord {
  id: number;
  happy: number;
  sad: number;
  stress: number;
  calm: number;
  excited: number;
  tired: number;
  music_ids: string;
  action_ids: string;
  book_ids: string;
  created_at: string;
}

async function getUserRecord(): Promise<UserRecord | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';

  try {
    const res = await fetch(`${API_BASE_URL}/test/record`);
    if (!res.ok) return null;
    console.log(res);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getLatestRecords(): Promise<UserRecord[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';
  console.log("Fetching from:", API_BASE_URL);
  try {
    const response = await fetch(`${API_BASE_URL}/test/record/latest`);

    if (!response.ok) {
      console.error('데이터 요청 실패:', response.statusText);
      console.log(`response.text():`, await response.text()); // 에러 메시지 출력
      response.text()
      return [];
    }

    const records: UserRecord[] = await response.json();
    return records;
  } catch (error) {
    console.error('API 호출 중 오류:', error);
    return [];
  }
}

export default async function RecordDetailPage() {
  const recommend = await getUserRecord();
  const records = await getLatestRecords();
  if (!recommend) {
    return <p>데이터를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h1>User Record Detail By Id</h1>
      {recommend ? (
        <div>
          <p>행복: {recommend.happy}</p>
          <p>슬픔: {recommend.sad}</p>
          <p>스트레스: {recommend.stress}</p>
          <p>평온함: {recommend.calm}</p>
          <p>신남: {recommend.excited}</p>
          <p>피곤함: {recommend.tired}</p>
          <p>음악 추천: {recommend.music_ids}</p>
          <p>행동 추천: {recommend.action_ids}</p>
          <p>도서 추천: {recommend.book_ids}</p>
          <p>생성일: {recommend.created_at}</p>
        </div>
      ) : (
        <p>데이터를 찾을 수 없습니다.2</p>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>최근 감정 기록 7개</h2>
      {records.length === 0 ? (
        <p>최근 데이터가 없습니다.</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r.id}>
              <strong>ID: {r.id}</strong> | 생성일: {r.created_at}
              <br />
              행복: {r.happy}, 슬픔: {r.sad}, 스트레스: {r.stress}, 
              평온함: {r.calm}, 신남: {r.excited}, 피곤함: {r.tired}
              <br />
              음악: {r.music_ids}
              행동: {r.action_ids} 
              도서: {r.book_ids}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}