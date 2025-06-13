package com.boot.analize.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.analize.dto.AnalizeContactDTO;
import com.boot.analize.dto.AnalizeFeedbackDTO;
import com.boot.analize.service.ContactAnalize;
import com.boot.analize.service.FeedbackAnalize;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class AnalizeController {

	@Autowired
	private ContactAnalize contactAnalize;
	@Autowired
	private FeedbackAnalize feedbackAnalize;

	// 일자별/시간대 별 문의하기 수
	@GetMapping("/analize-contact")
	public ResponseEntity<?> contactAnalize(@RequestParam("created_date") String created_date) {

		try {
			List<AnalizeContactDTO> dtos = contactAnalize.countContact(created_date);
			Map<Integer, Object> response = new HashMap<>();
			log.info("@# created_date =>" + created_date);
			log.info("@# dtos.size(); =>" + dtos.size());

			int[] haveNumber = new int[dtos.size()];

			for (int i = 0; i < dtos.size(); i++) {
				log.info("@3 dtos.get(" + i + ") =>" + dtos.get(i));
				haveNumber[i] = Integer.parseInt(dtos.get(i).getCreatedTime());
			}

			int time_count = 0;
			for (int i = 0; i < 24; i++) {
				response.put(time_count, 0);
				time_count++;
			}

			time_count = 0;
			for (int i = 0; i < 24; i++) {
				for (int j = 0; j < haveNumber.length; j++) {
					if (time_count == haveNumber[j]) {
						response.remove(time_count);
						response.put(time_count, dtos.get(j).getCount());
					}
				}
				time_count++;
			}
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error(".분석 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}

	}

	// 일자별/카테고리 별 피드백 수
	@GetMapping("/analize-feedback")
	public ResponseEntity<?> feedbackAnalize(@RequestParam("created_date") String created_date) {
		try {
			List<AnalizeFeedbackDTO> dtos = feedbackAnalize.countFeedback(created_date);
			log.info("@# feedback created_date =>" + created_date);
			log.info("@# feedback dtos.size(); =>" + dtos.size());

			List<Map<String, Object>> responseList = new ArrayList<>();

			for (int i = 0; i < dtos.size(); i++) {
				Map<String, Object> response = new HashMap<>();
				response.put("feedback_category", dtos.get(i).getFeedback_category());
				response.put("count", dtos.get(i).getCount());
				response.put("avg_score", dtos.get(i).getAvg_score());

				log.info("" + i + response);

				responseList.add(response);
			}
			log.info("@# responseList => " + responseList);

			return ResponseEntity.ok(responseList);
		} catch (Exception e) {
			log.error(".분석 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	// 사용자 이탈 분석 : (Churn Analysis)
	@GetMapping("/analize-churn")
	public void churnAnalize(@RequestParam HashMap<String, String> param) {

	}
}
