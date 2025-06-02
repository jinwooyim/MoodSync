package com.boot.tensor;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
public class DataController {
    
    @GetMapping(value = "/training-data", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getTrainingData() {
        Map<String, Object> response = new HashMap<>();
        
        // 2차원 배열을 List로 변환하여 JSON 직렬화 개선
        Double[][] features = {
            // 여성 데이터
            {150.0, 45.0}, {155.0, 48.0}, {160.0, 50.0}, {162.0, 52.0}, {165.0, 55.0},
            {158.0, 47.0}, {163.0, 53.0}, {157.0, 49.0}, {161.0, 51.0}, {159.0, 48.0},
            
            // 남성 데이터
            {170.0, 65.0}, {175.0, 70.0}, {180.0, 80.0}, {185.0, 85.0}, {172.0, 68.0},
            {178.0, 75.0}, {183.0, 82.0}, {176.0, 72.0}, {181.0, 78.0}, {174.0, 69.0}
        };
        
        Integer[] labels = {
            // 여성 라벨 (0)
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            // 남성 라벨 (1)  
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        };
        
        response.put("features", Arrays.asList(features));
        response.put("labels", Arrays.asList(labels));
        response.put("status", "success");
        response.put("dataCount", features.length);
        response.put("description", "성별 예측을 위한 키/몸무게 훈련 데이터");
        
        System.out.println("훈련 데이터 요청 받음 - " + features.length + "개 샘플 반환");
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    // 나머지 메서드들도 동일하게 수정
    @GetMapping(value = "/train", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getTrainInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "모델 훈련을 시작하려면 POST 요청을 보내주세요");
        response.put("method", "POST");
        response.put("endpoint", "/api/train");
        response.put("example", "curl -X POST http://localhost:8485/api/train");
        response.put("status", "info");
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @PostMapping(value = "/train", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> trainModel() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            String tensorflowServerUrl = "http://localhost:4000/train";
            
            ResponseEntity<Map> result = restTemplate.postForEntity(tensorflowServerUrl, null, Map.class);
            
            if (result.getStatusCode().is2xxSuccessful()) {
                response.put("message", "모델 훈련이 성공적으로 완료되었습니다");
                response.put("tensorflowResponse", result.getBody());
                response.put("status", "success");
            } else {
                response.put("message", "모델 훈련 중 오류가 발생했습니다");
                response.put("status", "error");
            }
        } catch (Exception e) {
            response.put("message", "TensorFlow.js 서버 연결 중 오류: " + e.getMessage());
            response.put("status", "error");
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @PostMapping(value = "/save-prediction", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> savePrediction(@RequestBody Map<String, Object> predictionData) {
        Map<String, Object> response = new HashMap<>();
        
        System.out.println("예측 결과 저장: " + predictionData);
        
        response.put("message", "예측 결과가 저장되었습니다");
        response.put("status", "success");
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
    
    @GetMapping(value = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ML Server");
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }
}