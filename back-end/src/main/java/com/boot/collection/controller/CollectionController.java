package com.boot.collection.controller;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;
import com.boot.collection.service.CollectionService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import java.util.HashMap; // HashMap 임포트 추가

import com.boot.z_config.security.PrincipalDetails;
import com.boot.user.dto.BasicUserDTO;
import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService; // UserService 임포트 추가

@RestController
@RequestMapping("/api/collections")
@Slf4j
public class CollectionController {
    @Autowired
    private CollectionService collectionService;
    @Autowired
    private UserService userService; // UserService 주입

    @PostMapping
    public ResponseEntity<?> createCollection(@RequestBody CollectionDTO collection,@AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 인증되지 않은 경우
        }
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        collection.setUserId(user.getUserNumber()); 
        try {
            int result = collectionService.createCollection(collection);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body("Collection created successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create collection.");
            }
        } catch (Exception e) {
            log.error("컬렉션 생성 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating collection: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public int updateCollection(@PathVariable int id, @RequestBody CollectionDTO collection) {
//    	log.info("컬렉션 수정 - 사용자 ID (UserNumber): {}", collection.getUserId());
        collection.setCollectionId(id);
        return collectionService.updateCollection(collection);
    }

    @DeleteMapping("/{id}")
    public int deleteCollection(@PathVariable int id) {
        return collectionService.deleteCollection(id);
    }

    @GetMapping("/user-collections") 
    public ResponseEntity<List<CollectionDTO>> getCollections(@AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 인증되지 않은 경우
        }
        
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        
        List<CollectionDTO> collections = collectionService.getCollectionsByUserId(user.getUserNumber()); // 파라미터 타입을 String으로 변경
        return ResponseEntity.ok(collections);
    }
    @GetMapping
    public List<CollectionDTO> getAllCollections() {
        return collectionService.getAllCollections();
    }
    
    @PostMapping("/add-to-collection") 
    public ResponseEntity<?> getCollectionsForAddItem(@RequestBody(required = false) Map<String, Object> payload, @AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {

        if (principalDetails == null) {
//            log.warn("인증되지 않은 사용자의 컬렉션 목록 조회 시도.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // PrincipalDetails에서 userId 가져오기
        // PrincipalDetails 내부에 BasicUserDTO 객체가 있다고 가정합니다.
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        int userId = user.getUserNumber();
//        log.info("사용자 (ID: {}) 의 컬렉션 목록 조회 요청 (아이템 추가 전 선택용)", userId);

        try {
            // 컬렉션 목록만 가져오는 새로운 서비스 메소드 호출
            List<CollectionDTO> collections = collectionService.getCollectionsOnlyByUserId(userId);
            return ResponseEntity.ok(collections); 
        } catch (Exception e) {
            log.error("사용자 (ID: {}) 의 컬렉션 목록 조회 중 오류 발생: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("컬렉션 목록 조회 중 오류가 발생했습니다.");
        }
    }
    
    @PostMapping("/add-item")
    public ResponseEntity<?> addCollectionItem(@RequestBody CollectionItemDTO itemPayload, @AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
//            log.warn("인증되지 않은 사용자의 컬렉션 아이템 추가 시도.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        int userId = user.getUserNumber();
//        log.info("사용자 (ID: {}) 가 컬렉션 (ID: {}) 에 아이템 추가 요청.", userId, itemPayload.getCollectionId());

        try {
            // 컬렉션 서비스 호출하여 아이템 추가
            int result = collectionService.insertCollectionItem(itemPayload);

            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body("아이템이 컬렉션에 성공적으로 추가되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이템 추가에 실패했습니다.");
            }
        } catch (IllegalArgumentException e) {
            // 권한 없음 또는 유효하지 않은 컬렉션 ID 등의 경우
            log.error("컬렉션 아이템 추가 중 권한/유효성 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("컬렉션 아이템 추가 중 서버 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("컬렉션 아이템 추가 중 오류가 발생했습니다.");
        }
    }
    
    
}