# 🧠 MoodSync
## Emotion-based Recommendation System

**MoodSync**는 사용자의 감정 데이터를 기반으로 맞춤형 활동, 책, 음악을 추천하는 통합 감정 분석 플랫폼입니다.  
사용자의 감정 상태를 정량화하고, AI 모델을 통해 분석하며, 정서적 웰빙을 위한 맞춤형 콘텐츠를 제공합니다.

---

<img src="images/MoodSync_desc.png" alt="포스터" width="100%"/>

---

<h2>🌟 프로젝트 개요</h2>

 ✅*개발 완료*
| 기능명 | 설명 | 기여도 |
|--------|------|--------|
| **감정 슬라이더/이미지 프로세싱을 통한 감정 입력** | Kakao Map API를 활용해 지도 기반 충전소 위치 제공 | 중 ★ |
| **활동, 도서, 음악 추천 (감정별 100개씩)** | 공공데이터 API로 실시간 충전 상태 시각화 | 중 ★ |
| **사용자 감정 패턴 시계열 분석** <br> (지역 / 현재 지도 / 키워드) | Redis 캐시로 빠른 검색 + Elasticsearch로 정확도 높은 검색 | 하 ☆ |
| **게시판 및 공지사항 기능** | 커뮤니티 게시판 + 관리자 공지사항 등록/관리 | 상 ⭐ |
| **감정 기반 사용자 군집화 (Clustering)** | KAKAO API를 활용한 사용자 현재 위치부터 목적지까지의 경로 표시 및 경유지 제공 | 상 ⭐ |
| **사용자 이탈 가능성 예측 (Churn Prediction)** | 해당 충전소 30분 단위 예약기능 CRUD | 상 ⭐ |

⏳*개발 예정*<br>
| 기능명 | 설명 |
|--------|------|
| **즐겨찾기 기능** | 로그인 사용자 기반의 즐겨찾기 등록 및 <br> 마이페이지에서 관리 기능 제공 |
| **리뷰 및 별점 기능** | 사용자 리뷰 등록/수정/삭제 및 <br> 충전소 별점 평균 표시 |
| **마이페이지 기능** | 내 정보, 즐겨찾기, 내가 쓴 글/리뷰 등 <br> 개인화 정보 제공 |

---

<h2>🛠️ 기술 스택</h2>

### 📌 Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **TensorFlow.js (감정 예측)**

### 📌 Backend
- **Spring Boot**
- **MyBatis + Oracle DB**
- **RESTful API**
- **JWT 인증 시스템**

### 📌 데이터 및 모델링
- 사용자 감정 입력값 (행복, 슬픔, 스트레스, 차분함, 흥분, 피곤함)
- 예측 모델: TensorFlow.js 기반의 Multi-class Classification
- 이탈 분석 모델: 사용자 활동 수, 피드백, 최근 활동 기반 Churn 예측


---

<h2>📊 핵심 기능 설명</h2>

### ✅ 감정 기반 추천 시스템
- 6가지 감정에 따라 콘텐츠 추천
- DB에 저장된 100개의 추천 활동/책/음악 리스트 제공

### ✅ 감정 예측 모델
- 감정 입력(6차원 벡터) → 대표 감정 클래스 예측
- Express + TensorFlow.js 서버 구성

### ✅ 사용자 분석 기능
- 감정 이력 시계열 분석  
- 감정 유형별 사용자 군집화 (K-means 활용)
- 최근 활동 및 피드백 기반 이탈 가능성 예측

---

## 🎬 시연 영상

<details>
  <summary>전체적인 UI/UX 보기</summary>
  <p>메인 페이지 구성</p>
  
  <p>계정 설정</p>

  <p>Footer</p>

  <p>다크 모드</p>
</details>

<details>
  <summary>추천 요청하기 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>마이페이지 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>컬렉션 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>관리자페이지 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>문의하기 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>피드백 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>
