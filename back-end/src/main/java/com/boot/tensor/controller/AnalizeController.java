package com.boot.tensor.controller;

import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class AnalizeController {

	// 일자별/시간대 별 문의하기 수
	@GetMapping("/analize-contact")
	public void contactAnalize(@RequestParam HashMap<String, String> param) {

	}

	// 일자별/카테고리 별 피드백 수
	@GetMapping("/analize-feedback")
	public void feedbackAnalize(@RequestParam HashMap<String, String> param) {

	}

	// 일자별/시간대별 이용현황과 예측치
	@GetMapping("/analize-usingcount")
	public void countAnalize(@RequestParam HashMap<String, String> param) {

	}

	// 특정 사람의 특성 시간대나 요일별 감정 탐색 : 시계열 분석(Time Series Analysis)
	@GetMapping("/analize-record")
	public void recordAnalize(@RequestParam HashMap<String, String> param) {

	}

	// 유사한 감정 행동 유사한 감정 행동 패턴을 가진 사용자 군집화 : 클러스터링(Clustering)
	@GetMapping("/analize-collection")
	public void collectionAnalize(@RequestParam HashMap<String, String> param) {

	}

	// 사용자 이탈 분석 : (Churn Analysis)
	@GetMapping("/analize-churn")
	public void churnAnalize(@RequestParam HashMap<String, String> param) {

	}
}
