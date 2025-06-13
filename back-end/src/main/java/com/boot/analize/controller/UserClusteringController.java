package com.boot.analize.controller;

import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class UserClusteringController {
	

	// 유사한 감정 행동 패턴을 가진 사용자 군집화 : 클러스터링(Clustering)
	@GetMapping("/analize-collection")
	public void collectionAnalize(@RequestParam HashMap<String, String> param) {

	}
}
