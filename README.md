# 🧠 MoodSync
## Emotion-based Recommendation System

**MoodSync**는 사용자의 감정 데이터를 기반으로 맞춤형 활동, 책, 음악을 추천하는 통합 감정 분석 플랫폼입니다.  
사용자의 감정 상태를 정량화하고, AI 모델을 통해 분석하며, 정서적 웰빙을 위한 맞춤형 콘텐츠를 제공합니다.

---

<img src="images/MoodSync_desc.png" alt="포스터" width="100%"/> 

---

<h2>🌟프로젝트 기능개요(기여도: 상: ⭐/ 중: ★/ 하: ☆)</h2>

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
  
<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
</p>

### 📌 Backend

- **Spring Boot**
- **MyBatis + Oracle DB**
- **RESTful API**
- **JWT 인증 시스템**

<p align="left">
  <img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/MyBatis-35495E?style=for-the-badge&logo=databricks&logoColor=white"/>
  <img src="https://img.shields.io/badge/Oracle DB-F80000?style=for-the-badge&logo=oracle&logoColor=white"/>
  <img src="https://img.shields.io/badge/REST API-000000?style=for-the-badge&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
</p>

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

## 🎬 전체 보기(자세히)

<details>
  <summary>✨테마 UI/UX 보기</summary>

  <h3>◈ 메인 페이지 구성</h3>
  <img src="images/total/main_page.png" alt="main_page" width="100%"/>

  
  <h3>◈ 메인 기능 UI</h3>
  <img src="images/total/main_func.png" alt="main_func" width="100%"/>


  <h3>◈ 로그인/회원가입 UI</h3>
  <img src="images/total/main_join.png" alt="main_join" width="100%"/>


  <h3>◈ Footer</h3>
  <img src="images/total/footer_info.png" alt="footer_info" width="100%"/>
    <details>
      <summary><h4>개인정보 처리방침</h4></summary>
      <img src="images/total/footer_info_rule.png" alt="footer_info_rule" width="100%"/>
    </details>
    <details>
      <summary><h4>이용약관</h4></summary>
      <img src="images/total/footer_info_using.png" alt="footer_info_using" width="100%"/>
    </details>
    <details>
      <summary><h4>회사소개</h4></summary>
      <img src="images/total/footer_info_company.png" alt="footer_info_company" width="100%"/>
    </details>

  
  <h3>◈ 다크 모드</h3>
  <img src="images/total/main_dark.png" alt="main_dark" width="100%"/>

  <p>이 이외의 UI/UX에 대해서는 다른 기능설명에서 제공하도록 하겠습니다!</p>
  
</details>

<details>
  <summary>✨추천 요청하기 보기</summary>
  <h3>◈ 사용자 감정 입력 UI</h3>
  <img src="images/recommendation/emotion_select_UI.png" alt="emotion_select_UI" width="100%"/>

  
  <h3>◈ 메인 기능 UI</h3>
  <img src="images/total/main_func.png" alt="main_func" width="100%"/>


  <h3>◈ 로그인/회원가입 UI</h3>
  <img src="images/total/main_join.png" alt="main_join" width="100%"/>


  <h3>◈ Footer</h3>
  <img src="images/total/footer_info.png" alt="footer_info" width="100%"/>
    <details>
      <summary><h4>개인정보 처리방침</h4></summary>
      <img src="images/total/footer_info_rule.png" alt="footer_info_rule" width="100%"/>
    </details>
    <details>
      <summary><h4>이용약관</h4></summary>
      <img src="images/total/footer_info_using.png" alt="footer_info_using" width="100%"/>
    </details>
    <details>
      <summary><h4>회사소개</h4></summary>
      <img src="images/total/footer_info_company.png" alt="footer_info_company" width="100%"/>
    </details>

  
  <h3>◈ 다크 모드</h3>
  <img src="images/total/main_dark.png" alt="main_dark" width="100%"/>
</details>

<details>
  <summary>✨마이페이지 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>✨컬렉션 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>✨관리자페이지 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>✨문의하기 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

<details>
  <summary>✨피드백 보기</summary>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/영상ID" frameborder="0" allowfullscreen></iframe>
</details>

---

<h2>🧬 테이블 명세서 및 ERD </h2>

<h3> Entity-Relationship Diagram </h3>
<img src="images/ERD.png" alt="ERD" width="100%"/>
<details>
  <summary><h4> 🔍테이블 세부 명세서🔍 </h4></summary>
  <img src="images/ERD_desc1.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc2.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc3.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc4.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc5.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc6.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc7.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc8.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc9.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc10.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc11.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc12.webp" alt="ERD" width="100%"/>
  <img src="images/ERD_desc13.webp" alt="ERD" width="100%"/>
</details>

---

## 🗂️ 시스템 구조도
 <img src="images/system_structure.webp" alt="system_structure" width="100%"/>


