package com.boot.tensor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.boot.tensor.dto.ActingDTO;
import com.boot.tensor.service.ActingService;
import com.boot.tensor.service.BookService;
import com.boot.tensor.service.MusicService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class DataController {

	@Autowired
	private ActingService actingService;

	@Autowired
	private MusicService musicService;

	@Autowired
	private BookService bookService;

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
		String nodeUrl = "http://localhost:4000/predict"; // Node 서버 주소

		log.info("@# emotionMap =>" + emotionMap);

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

	@RequestMapping("/getList")
//	public ResponseEntity<?> getList(@RequestParam("emotionNumber") int emotionNumber, Model model) {
	public ResponseEntity<?> getList(Model model) {
		ArrayList<ActingDTO> acting_dtos = actingService.getRandomActing(3);
		model.addAttribute("actingList", acting_dtos);

		return null;
	}
}