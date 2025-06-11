package com.boot.tensor.service;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.BookDAO;
import com.boot.tensor.dto.BookDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private SqlSession session;

    // 감정 매핑 상수
    private static final Map<String, String> EMOTION_MAPPING = Map.of(
            "happy", "happy", 
            "sad", "sad", 
            "stressed", "stress", 
            "calm", "calm", 
            "excited", "excited", 
            "tired", "tired"
    );

    // 클러스터 중심점 (미리 정의된 감정 프로필)
    private static final List<double[]> CLUSTER_CENTROIDS = Arrays.asList(
            new double[]{0.8, 0.2, 0.2, 0.5, 0.7, 0.1},  // 행복 중심
            new double[]{0.2, 0.8, 0.6, 0.3, 0.1, 0.5},  // 슬픔 중심
            new double[]{0.3, 0.4, 0.8, 0.2, 0.3, 0.6},  // 스트레스 중심
            new double[]{0.4, 0.2, 0.2, 0.8, 0.3, 0.2},  // 평온 중심
            new double[]{0.6, 0.1, 0.3, 0.3, 0.9, 0.2},  // 흥분 중심
            new double[]{0.2, 0.5, 0.4, 0.3, 0.1, 0.8}   // 피곤 중심
    );

    @Override
    public ArrayList<BookDTO> getRandomBook(int bookSubNumber, Object userEmotionData) {
        BookDAO dao = session.getMapper(BookDAO.class);
        ArrayList<BookDTO> dtos = dao.getRandomBook(bookSubNumber);

        log.info("@# BookService - bookSubNumber: {}, 조회된 책 수: {}, userEmotionData: {}", 
                bookSubNumber, dtos.size(), userEmotionData);

        // 책이 충분하지 않은 경우 다른 감정의 책들도 추가로 가져오기
        if (dtos.size() < 5) {
            log.info("책이 부족합니다. 다른 감정의 책들도 추가로 조회합니다.");

            // 모든 감정 번호에서 추가 책들 가져오기
            for (int i = 1; i <= 6; i++) {
                if (i != bookSubNumber && dtos.size() < 10) {
                    ArrayList<BookDTO> additionalBooks = dao.getRandomBook(i);
                    for (BookDTO book : additionalBooks) {
                        // 중복 제거
                        boolean isDuplicate = dtos.stream()
                                .anyMatch(existingBook -> existingBook.getBookNumber() == book.getBookNumber());
                        if (!isDuplicate) {
                            dtos.add(book);
                        }
                    }
                }
            }
            log.info("추가 조회 후 총 책 수: {}", dtos.size());
        }

        if (userEmotionData != null && userEmotionData instanceof Map && dtos.size() >= 3) {
            // 하이브리드 추천 알고리즘 적용
            List<BookRecommendation> recommendations = recommendBooks(
                    dtos, (Map<String, Object>) userEmotionData);

            List<BookDTO> topRecommendations = recommendations.stream()
                    .map(BookRecommendation::getBook)
                    .collect(Collectors.toList());

            log.info("=== 하이브리드 추천 결과 ===");
            for (int i = 0; i < recommendations.size(); i++) {
                BookRecommendation rec = recommendations.get(i);
                log.info("{}위: {} (점수: {:.4f}, 방법: {})", 
                        i + 1, rec.getBook().getBookName(), rec.getScore(), rec.getMethod());
            }

            return new ArrayList<>(topRecommendations);
        } else if (dtos.size() < 3) {
            log.warn("책이 3개 미만입니다. 추천을 수행할 수 없습니다. 조회된 책 수: {}", dtos.size());
        }

        // 책이 부족하거나 userEmotionData가 없는 경우 원본 반환
        return dtos;
    }

    /**
     * 하이브리드 추천 알고리즘
     * - 클러스터링: 사용자 감정과 유사한 감정 클러스터 찾기
     * - 콘텐츠 기반: 감정 벡터 유사도 계산
     * - 다양성: 최종 추천 목록에서 다양성 확보
     */
    private List<BookRecommendation> recommendBooks(List<BookDTO> books, Map<String, Object> userEmotionData) {
        // 결과 저장용 리스트
        List<BookRecommendation> recommendations = new ArrayList<>();
        Set<String> usedBookNames = new HashSet<>();
        
        // 사용자 감정 벡터 생성
        double[] userVector = convertUserEmotionToVector(userEmotionData);
        
        // 1. 클러스터링 기반 추천
        int closestCluster = findClosestCluster(userVector);
        BookRecommendation clusterRecommendation = recommendByCluster(books, closestCluster, usedBookNames);
        
        if (clusterRecommendation != null) {
            recommendations.add(clusterRecommendation);
            usedBookNames.add(clusterRecommendation.getBook().getBookName());
            log.info("클러스터 {} 기반 추천: {}", closestCluster, clusterRecommendation.getBook().getBookName());
        }
        
        // 2. 콘텐츠 기반 추천 (감정 유사도)
        BookRecommendation contentRecommendation = recommendByContent(books, userVector, usedBookNames);
        
        if (contentRecommendation != null) {
            recommendations.add(contentRecommendation);
            usedBookNames.add(contentRecommendation.getBook().getBookName());
            log.info("콘텐츠 기반 추천: {}", contentRecommendation.getBook().getBookName());
        }
        
        // 3. 다양성 기반 추천
        List<BookDTO> selectedBooks = recommendations.stream()
                .map(BookRecommendation::getBook)
                .collect(Collectors.toList());
                
        BookRecommendation diversityRecommendation = recommendByDiversity(books, selectedBooks, usedBookNames);
        
        if (diversityRecommendation != null) {
            recommendations.add(diversityRecommendation);
            log.info("다양성 기반 추천: {}", diversityRecommendation.getBook().getBookName());
        }
        
        return recommendations;
    }
    
    /**
     * 클러스터 기반 추천
     * 특정 감정 클러스터에 가장 잘 맞는 책 추천
     */
    private BookRecommendation recommendByCluster(List<BookDTO> books, int clusterIndex, Set<String> usedBookNames) {
        double[] clusterCentroid = CLUSTER_CENTROIDS.get(clusterIndex);
        
        BookDTO bestBook = null;
        double bestScore = -1.0;
        double jitter = new Random().nextDouble() * 0.1; // 약간의 무작위성 추가
        
        for (BookDTO book : books) {
            if (usedBookNames.contains(book.getBookName())) {
                continue;
            }
            
            double[] bookVector = convertBookEmotionToVector(book);
            double similarity = calculateCosineSimilarity(clusterCentroid, bookVector);
            double score = similarity + jitter; // 무작위성 추가
            
            if (score > bestScore) {
                bestScore = score;
                bestBook = book;
            }
        }
        
        return bestBook != null ? new BookRecommendation(bestBook, bestScore, "클러스터링") : null;
    }
    
    /**
     * 콘텐츠 기반 추천
     * 사용자 감정과 직접적으로 유사한 책 추천
     */
    private BookRecommendation recommendByContent(List<BookDTO> books, double[] userVector, Set<String> usedBookNames) {
        List<BookRecommendation> candidates = new ArrayList<>();
        
        for (BookDTO book : books) {
            if (usedBookNames.contains(book.getBookName())) {
                continue;
            }
            
            double[] bookVector = convertBookEmotionToVector(book);
            double similarity = calculateCosineSimilarity(userVector, bookVector);
            candidates.add(new BookRecommendation(book, similarity, "콘텐츠"));
        }
        
        // 상위 3개 중에서 랜덤 선택
        candidates.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        int topN = Math.min(3, candidates.size());
        
        if (topN > 0) {
            Random random = new Random();
            int randomIndex = random.nextInt(topN);
            return candidates.get(randomIndex);
        }
        
        return null;
    }
    
    /**
     * 다양성 기반 추천
     * 이미 선택된 책들과 최대한 다른 책 추천
     */
    private BookRecommendation recommendByDiversity(
            List<BookDTO> books, List<BookDTO> selectedBooks, Set<String> usedBookNames) {
        
        BookDTO mostDiverse = null;
        double highestDiversityScore = -1.0;
        
        for (BookDTO book : books) {
            if (usedBookNames.contains(book.getBookName())) {
                continue;
            }
            
            double diversityScore = calculateDiversityScore(book, selectedBooks);
            
            if (diversityScore > highestDiversityScore) {
                highestDiversityScore = diversityScore;
                mostDiverse = book;
            }
        }
        
        return mostDiverse != null ? 
                new BookRecommendation(mostDiverse, highestDiversityScore, "다양성") : null;
    }
    
    /**
     * 가장 가까운 감정 클러스터 찾기
     */
    private int findClosestCluster(double[] userVector) {
        int closestCluster = 0;
        double highestSimilarity = -1.0;
        
        for (int i = 0; i < CLUSTER_CENTROIDS.size(); i++) {
            double similarity = calculateCosineSimilarity(userVector, CLUSTER_CENTROIDS.get(i));
            
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                closestCluster = i;
            }
        }
        
        return closestCluster;
    }
    
    /**
     * 다양성 점수 계산
     * 이미 선택된 책들과의 평균 거리 (1 - 유사도)
     */
    private double calculateDiversityScore(BookDTO candidate, List<BookDTO> selectedBooks) {
        if (selectedBooks.isEmpty()) {
            return 1.0;
        }
        
        double[] candidateVector = convertBookEmotionToVector(candidate);
        double totalDiversity = 0.0;
        
        for (BookDTO selected : selectedBooks) {
            double[] selectedVector = convertBookEmotionToVector(selected);
            double similarity = calculateCosineSimilarity(candidateVector, selectedVector);
            totalDiversity += (1.0 - similarity); // 유사도의 반대 = 다양성
        }
        
        return totalDiversity / selectedBooks.size();
    }

    /**
     * 사용자 감정 데이터를 정규화된 벡터로 변환
     */
    private double[] convertUserEmotionToVector(Map<String, Object> userEmotionData) {
        double[] vector = new double[6]; // happy, sad, stress, calm, excited, tired

        // 사용자 감정 데이터에서 값 추출 (0.0 ~ 1.0 범위)
        vector[0] = getEmotionValue(userEmotionData, "happy");
        vector[1] = getEmotionValue(userEmotionData, "sad");
        vector[2] = getEmotionValue(userEmotionData, "stressed");
        vector[3] = getEmotionValue(userEmotionData, "calm");
        vector[4] = getEmotionValue(userEmotionData, "excited");
        vector[5] = getEmotionValue(userEmotionData, "tired");

        return normalizeVector(vector);
    }

    /**
     * 책의 감정 점수를 정규화된 벡터로 변환
     */
    private double[] convertBookEmotionToVector(BookDTO book) {
        double[] vector = new double[6];

        // 책의 감정 점수 (0 ~ 100 범위를 0.0 ~ 1.0으로 정규화)
        vector[0] = book.getHappy() / 100.0;
        vector[1] = book.getSad() / 100.0;
        vector[2] = book.getStress() / 100.0;
        vector[3] = book.getCalm() / 100.0;
        vector[4] = book.getExcited() / 100.0;
        vector[5] = book.getTired() / 100.0;

        return normalizeVector(vector);
    }

    /**
     * 감정 값 추출 (안전한 형변환)
     */
    private double getEmotionValue(Map<String, Object> emotionData, String key) {
        Object value = emotionData.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }

    /**
     * 벡터 정규화 (L2 norm)
     */
    private double[] normalizeVector(double[] vector) {
        double magnitude = 0.0;
        for (double v : vector) {
            magnitude += v * v;
        }
        magnitude = Math.sqrt(magnitude);

        if (magnitude == 0.0) {
            return vector; // 영벡터인 경우 그대로 반환
        }

        double[] normalized = new double[vector.length];
        for (int i = 0; i < vector.length; i++) {
            normalized[i] = vector[i] / magnitude;
        }
        return normalized;
    }

    /**
     * 코사인 유사도 계산
     */
    private double calculateCosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("벡터 길이가 다릅니다.");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA == 0.0 || normB == 0.0) {
            return 0.0; // 영벡터인 경우
        }

        return dotProduct / (normA * normB);
    }

    /**
     * 책 추천 결과를 저장하는 내부 클래스
     */
    private static class BookRecommendation {
        private final BookDTO book;
        private final double score;
        private final String method;

        public BookRecommendation(BookDTO book, double score, String method) {
            this.book = book;
            this.score = score;
            this.method = method;
        }

        public BookDTO getBook() {
            return book;
        }

        public double getScore() {
            return score;
        }

        public String getMethod() {
            return method;
        }
    }

    @Override
    public ArrayList<BookDTO> getBookDTO() {
        BookDAO dao = session.getMapper(BookDAO.class);
        ArrayList<BookDTO> resultList = dao.getBookDTO();
        return resultList;
    }
}
