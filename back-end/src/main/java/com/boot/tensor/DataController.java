package com.boot.tensor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class DataController {

	@GetMapping("/training-data")
	public Map<String, Object> getTrainingData() {
		Map<String, Object> response = new HashMap<>();

		// 샘플 훈련 데이터
		double[][] features = { { 160, 50 }, { 165, 55 }, { 155, 48 }, { 170, 65 }, { 175, 70 }, { 162, 52 },
				{ 158, 47 }, { 180, 80 }, { 185, 85 }, { 172, 68 } };

		int[] labels = { 0, 0, 0, 1, 1, 0, 0, 1, 1, 1 };

		log.info("@# features => " + features[1][1]);
		log.info("@# labels => " + labels[1]);

		response.put("features", features);
		response.put("labels", labels);
		response.put("status", "success");

		log.info("@# training-data features => " + response.get("features"));
		log.info("@# training-data labels => " + response.get("labels"));

		return response;
	}

	@PostMapping("/save-prediction")
	public Map<String, Object> savePrediction(@RequestBody Map<String, Object> predictionData) {
		Map<String, Object> response = new HashMap<>();

		// 예측 결과 저장 로직 (DB 저장 등)
		System.out.println("예측 결과 저장: " + predictionData);

		response.put("message", "예측 결과가 저장되었습니다");
		response.put("status", "success");

		return response;
	}

	@GetMapping("/health")
	public Map<String, String> health() {
		Map<String, String> response = new HashMap<>();
		response.put("status", "UP");
		response.put("service", "ML Server");
		return response;
	}
}