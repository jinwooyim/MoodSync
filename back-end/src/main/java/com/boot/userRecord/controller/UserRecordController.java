package com.boot.userRecord.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.userRecord.dto.UserRecordDTO;
import com.boot.userRecord.service.UserRecordService;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserRecordController {
	@Autowired
	private UserRecordService userRecordService;
	
	// http://localhost:3000/recordTest <- 데이터 출력 테스트 중
	@GetMapping(value = "/test/record", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserRecordDTO> getRecordById() {
		Long id = (long) 5;
	    UserRecordDTO myInfo = userRecordService.findById(id); // DB 조회
	    if (myInfo != null) {
	    	log.info("최종 응답 DTO: {}", myInfo);
	        return ResponseEntity.ok(myInfo); // JSON으로 반환
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
    @GetMapping(value = "/test/record/latest", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserRecordDTO>> getLatestRecords() {
    	List<UserRecordDTO> list = userRecordService.getLatestRecords();
    	
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
