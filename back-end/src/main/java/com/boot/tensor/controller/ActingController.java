package com.boot.tensor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.tensor.dto.ActingDTO;
import com.boot.tensor.service.ActingService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class ActingController {

	@Autowired
	private ActingService actingService;

	// 학습 데이터
	@GetMapping("/act-data")
	public ResponseEntity<?> getTrainingData() {
		try {
			ArrayList<ActingDTO> actingList = actingService.getActingDTO();

			// features 배열과 labels 배열 구성
			ArrayList<List<Integer>> features = new ArrayList<>();
			ArrayList<Integer> labels = new ArrayList<>();

			for (ActingDTO dto : actingList) {
				List<Integer> feature = new ArrayList<>();
				feature.add(dto.getHappy());
				feature.add(dto.getSad());
				feature.add(dto.getStress());
				feature.add(dto.getCalm());
				feature.add(dto.getExcited());
				feature.add(dto.getTired());

				features.add(feature);
				labels.add(dto.getEmotionNumber());
			}

			Map<String, Object> response = new HashMap<>();
			response.put("features", features);
			response.put("labels", labels);

			log.info("@# act features => " + features);
			log.info("@# act features_count => " + features.size());
			log.info("@# act labels => " + labels);
			log.info("@# act labels_count => " + labels.size());

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", e.getMessage());

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

}