package com.boot.tensor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.tensor.dto.ActingDTO;
import com.boot.tensor.dto.BookDTO;
import com.boot.tensor.dto.MusicDTO;
import com.boot.tensor.service.ActingService;
import com.boot.tensor.service.BookService;
import com.boot.tensor.service.MusicService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class DataController {

	@Autowired
	private ActingService actingService;

	@Autowired
	private MusicService musicService;

	@Autowired
	private BookService bookService;

	@PostMapping("/emotion-result")
	public ResponseEntity<?> executePredict(@RequestBody Map<String, Object> payload) {
		log.info("@# 실행 emotion-result");
		log.info("@# payload =>" + payload);
		Map<String, Object> actMap = (Map<String, Object>) payload.get("act");
		int actPredictedClass = (int) actMap.get("predictedClass");
		log.info("@# actPredictedClass =>" + actPredictedClass);

		Map<String, Object> musicMap = (Map<String, Object>) payload.get("music");
		int musicPredictedClass = (int) musicMap.get("predictedClass");
		log.info("@# musicPredictedClass =>" + musicPredictedClass);

		Map<String, Object> bookMap = (Map<String, Object>) payload.get("book");
		int bookPredictedClass = (int) bookMap.get("predictedClass");
		log.info("@# bookPredictedClass =>" + bookPredictedClass);

		ArrayList<ActingDTO> act_dtos = getListActing(actPredictedClass + 1);
		ArrayList<MusicDTO> music_dtos = getListMusic(musicPredictedClass + 1);
		ArrayList<BookDTO> book_dtos = getListBook(bookPredictedClass + 1);

		Map<String, Object> result = new HashMap<>();

		result.put("act_dtos", act_dtos);
		result.put("music_dtos", music_dtos);
		result.put("book_dtos", book_dtos);

		log.info("@# result =>" + result);

		return ResponseEntity.ok(result);
	}

	// 해당 감정 통해서 랜덤 3개의 음악, 행동, 도서 추출
	// 행동
	public ArrayList<ActingDTO> getListActing(int emotionNumber) {
		ArrayList<ActingDTO> acting_dtos = actingService.getRandomActing(emotionNumber);
		return acting_dtos;
	}

	// 음악
	public ArrayList<MusicDTO> getListMusic(int emotionNumber) {
		ArrayList<MusicDTO> music_dtos = musicService.getRandomMusic(emotionNumber);
		return music_dtos;
	}

	// 도서
	public ArrayList<BookDTO> getListBook(int emotionNumber) {

		ArrayList<BookDTO> book_dtos = bookService.getRandomBook(emotionNumber);
		return book_dtos;
	}
}