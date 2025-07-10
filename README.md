# 🧠 MoodSync
## Emotion-based Recommendation System

**MoodSync**는 사용자의 감정 데이터를 기반으로 맞춤형 활동, 책, 음악을 추천하는 통합 감정 분석 플랫폼입니다.  
사용자의 감정 상태를 정량화하고, AI 모델을 통해 분석하며, 정서적 웰빙을 위한 맞춤형 콘텐츠를 제공합니다.

---

<img src="images/MoodSync_desc.png" alt="포스터" width="100%"/>

---

<h2>🌟프로젝트 기능개요(기여도: 상: ⭐/ 중: ★/ 하: ☆)</h2>

 ✅*개발 완료*
| 기능명 | 설명 | 기여도 |
|--------|------|--------|
| **이미지 프로세싱/슬라이더를 통한 감정입력** | Face-API를 이용한 얼굴인식 / Slider를 이용한 6개 감정 조절 | 중 ★ |
| **활동, 도서, 음악 추천 (감정별 100개씩)** | tensorflow.js를 활용한 ML 기반 추천시스템 구현 | 상 ⭐ |
| **사용자 추천 컬렉션 기능** | 추천받은 항목들을 그룹화 할 수 있는 컬렉션 CRUD 구현 | 하 ☆ |
| **사용자 추천 내기록 기능** | 추천받은 이력 View 및 일자별 감정차트 구현 | 하 ☆ |
| **관리자페이지 구현** | 문의하기, 피드백을 통한 소통공간 창출 및 학습갱신 구현 | 중 ★ |
| **사용자 문의하기 시계열 분석 <br>(Time Series)** | 일자별/시간대별 문의하기 분석차트 구현 | 상 ⭐ |
| **감정 기반 사용자 군집화 <br>(Clustering & Cohesion)** | 일자별 전체 유저의 감정지수 군집화 및 사이트 테마감정 제공 | 중 ★ |
| **사용자 이탈 가능성 예측 <br>(Churn Prediction)** | 이탈지표를 이용한 웹사이트 이탈 가능성 예측 | 상 ⭐ |

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

<h2>📊 핵심 세부기능 설명</h2>

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
