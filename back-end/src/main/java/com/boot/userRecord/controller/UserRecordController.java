package com.boot.userRecord.controller;

import java.time.LocalDate;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.user.dto.BasicUserDTO;
import com.boot.userRecord.dto.UserRecordDTO;
import com.boot.userRecord.service.UserRecordService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserRecordController {
	@Autowired
	private UserRecordService userRecordService;
	
	@GetMapping(value = "/test/userRecord", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserRecordDTO> getUserRecordByDate(@RequestParam("date") String dateStr, HttpServletRequest request) {
		
		log.info("조회할 userNumber: {}, 조회할 날짜: {}", 3, dateStr);
		
		LocalDate date;
	    try {
	        date = LocalDate.parse(dateStr); // yyyy-MM-dd 형식
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().build(); // 잘못된 형식 처리
	    }
	    
//		UserRecordDTO myInfo = userRecordService.findByNumAndDate(userNumber, today); // DB 조회
		UserRecordDTO myInfo = userRecordService.findByNumAndDate(3, date); // DB 조회
		if (myInfo != null) {
			log.info("최종 응답 DTO: {}", myInfo);
			return ResponseEntity.ok(myInfo); // JSON으로 반환
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	
	
    @GetMapping(value = "/test/record/latest", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserRecordDTO>> getLatestRecords(HttpServletRequest request) {
//    	BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
//		int userNumber = user.getUserNumber();
		
//    	List<UserRecordDTO> list = userRecordService.getLatestRecords(userNumber);
    	List<UserRecordDTO> list = userRecordService.getLatestRecords(3);
    	
	    if (list != null) {
	    	for(int i=0; i<list.size(); i++) {
	    		log.info("list DTO {} : {}", i, list.get(i));
	    	}
	        return ResponseEntity.ok(list);
	    } else {
	        return ResponseEntity.noContent().build();
	    }
    }
    
}
