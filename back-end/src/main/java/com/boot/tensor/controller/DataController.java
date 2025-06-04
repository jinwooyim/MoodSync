package com.boot.tensor.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class DataController {

	@PostMapping("/predict")
	public ResponseEntity<?> executePredict(@RequestParam double happy, @RequestParam double sad,
			@RequestParam double stress, @RequestParam double calm, @RequestParam double excited,
			@RequestParam double tired) {

		Map<String, Double> emotionMap = new HashMap<>();
		emotionMap.put("happy", happy);
		emotionMap.put("sad", sad);
		emotionMap.put("stress", stress);
		emotionMap.put("calm", calm);
		emotionMap.put("excited", excited);
		emotionMap.put("tired", tired);

		RestTemplate restTemplate = new RestTemplate();
		String nodeUrl = "http://localhost:3000/predict"; // Node 서버 주소

		try {
			// POST 요청
			ResponseEntity<String> response = restTemplate.postForEntity(nodeUrl, emotionMap, String.class);

			// 3. Node.js 응답 그대로 반환
			return ResponseEntity.ok(response.getBody());

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Node 예측 요청 실패: " + e.getMessage());
		}
	}

}