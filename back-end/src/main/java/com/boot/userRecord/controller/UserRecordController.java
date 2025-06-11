package com.boot.userRecord.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.userRecord.dto.UserRecordDTO;
import com.boot.userRecord.service.UserRecordService;
import com.boot.z_config.security.PrincipalDetails;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class UserRecordController {
	@Autowired
	private UserRecordService userRecordService;
	@Autowired
	private UserService userService;
	
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
	
	
	// 인증 테스트 실패 
//	@GetMapping(value = "/test/userRecord", produces = MediaType.APPLICATION_JSON_VALUE)
//	public ResponseEntity<UserRecordDTO> getUserRecordByDate(
//			@RequestParam("date") String dateStr,
//			Authentication authentication
//	) {
//		
//		// 인증 검증
//	    if (authentication == null || !authentication.isAuthenticated() ||
//	        authentication.getPrincipal() == null ||
//	        "anonymousUser".equals(authentication.getPrincipal()) ||
//	        !(authentication.getPrincipal() instanceof PrincipalDetails)) {
//	        log.warn("인증되지 않은 사용자의 userRecord 조회 시도");
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	    }
//
//	    // 로그인한 사용자 ID 획득
//	    PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
//	    String loggedInUserId = principal.getUsername(); // = userId
//
//	    // userId로 userNumber 가져오기
//	    HashMap<String, String> param = new HashMap<>();
//	    param.put("userId", loggedInUserId);
//	    UserDTO user = userService.getUserInfo(param);
//
//	    if (user == null || user.getUserNumber() == 0) {
//	        log.error("사용자 정보 조회 실패 - userId: {}", loggedInUserId);
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//	    }
//		
//		LocalDate date;
//	    try {
//	        date = LocalDate.parse(dateStr); // yyyy-MM-dd 형식
//	    } catch (Exception e) {
//	        return ResponseEntity.badRequest().build(); // 잘못된 형식 처리
//	    }
//	    
//	    log.info("userNumber: {}, 조회 날짜: {}", user.getUserNumber(), date);
//	    UserRecordDTO myInfo = userRecordService.findByNumAndDate(user.getUserNumber(), date);
//	    if (myInfo != null) {
//	        log.info("조회 결과: {}", myInfo);
//	        return ResponseEntity.ok(myInfo);
//	    } else {
//	        return ResponseEntity.notFound().build();
//	    }
//	}
	 
	
	
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
    
    // 인증 테스트 실패
//    @GetMapping(value = "/test/record/latest", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<List<UserRecordDTO>> getLatestRecords(
//            Authentication authentication
//    ) {
//        // 인증 유효성 검사
//        if (authentication == null || !authentication.isAuthenticated() ||
//            authentication.getPrincipal() == null ||
//            "anonymousUser".equals(authentication.getPrincipal()) ||
//            !(authentication.getPrincipal() instanceof PrincipalDetails)) {
//            log.warn("인증되지 않은 사용자의 최신 기록 조회 시도");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        // 로그인한 사용자 ID 가져오기
//        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
//        String userId = principal.getUsername();
//
//        // userId로부터 userNumber 조회
//        HashMap<String, String> param = new HashMap<>();
//        param.put("userId", userId);
//        UserDTO user = userService.getUserInfo(param);
//
//        if (user == null || user.getUserNumber() == 0) {
//            log.error("사용자 정보 조회 실패: {}", userId);
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//        }
//
//        int userNumber = user.getUserNumber();
//
//        // 최신 기록 조회
//        List<UserRecordDTO> list = userRecordService.getLatestRecords(userNumber);
//
//        if (list != null && !list.isEmpty()) {
//            for (int i = 0; i < list.size(); i++) {
//                log.info("list DTO {} : {}", i, list.get(i));
//            }
//            return ResponseEntity.ok(list);
//        } else {
//            return ResponseEntity.noContent().build();
//        }
//    }
    
}
