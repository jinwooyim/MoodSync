package com.boot.tensor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.tensor.dto.ActingDTO;
import com.boot.tensor.dto.MusicDTO;
import com.boot.tensor.service.ActingService;
import com.boot.tensor.service.MusicService;

@RestController
@RequestMapping("/api")
public class MusicController {
    
    @Autowired
    private MusicService musicService;
    
    // 기본 10개 조회
    @GetMapping("/music-data")
    public ResponseEntity<?> getActingData() {
        try {
            ArrayList<MusicDTO> musicList = musicService.getMusicDTO(100); // 1~100 범위에서 랜덤
            
//            for(int i=0;i<actingList.size();i++) {
//            	System.out.println("actingList["+i+"] => " + actingList.get(i));
//            }
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("count", musicList.size());
            response.put("data", musicList);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(errorResponse);
        }
    }
    
    // 범위 지정해서 조회
//    @GetMapping("/acting-data/{maxNumber}")
//    public ResponseEntity<?> getActingDataWithRange(@PathVariable int maxNumber) {
//        try {
//            if (maxNumber <= 0) {
//                Map<String, Object> errorResponse = new HashMap<>();
//                errorResponse.put("status", "error");
//                errorResponse.put("message", "maxNumber는 1 이상이어야 합니다");
//                return ResponseEntity.badRequest().body(errorResponse);
//            }
//            
//            ArrayList<ActingDTO> actingList = actingService.getActingDTO(maxNumber);
//            
//            Map<String, Object> response = new HashMap<>();
//            response.put("status", "success");
//            response.put("maxNumber", maxNumber);
//            response.put("count", actingList.size());
//            response.put("data", actingList);
//            
//            return ResponseEntity.ok(response);
//            
//        } catch (Exception e) {
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("status", "error");
//            errorResponse.put("message", e.getMessage());
//            
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                                .body(errorResponse);
//        }
//    }
    
}