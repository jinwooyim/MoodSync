package com.boot.collection.controller;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.service.CollectionService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap; // HashMap 임포트 추가

import com.boot.z_config.security.PrincipalDetails;
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
    public ResponseEntity<?> createCollection(
            @RequestBody CollectionDTO collection,
            Authentication authentication // Spring Security Authentication 객체 주입
    ) {
        log.info("createCollection 요청 시작=>"+collection);

        // 1. 인증 및 PrincipalDetails 검증
        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal() == null ||
            "anonymousUser".equals(authentication.getPrincipal()) ||
            !(authentication.getPrincipal() instanceof PrincipalDetails)) {
            log.warn("인증되지 않은 사용자의 컬렉션 생성 시도");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Not authenticated or invalid token.");
        }

        // PrincipalDetails에서 로그인된 사용자 ID를 가져옴
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        String loggedInUserId = principal.getUsername(); // PrincipalDetails의 getUsername()은 userId를 반환

        // PrincipalDetails 내의 UserDTO 대신, UserService를 통해 최신 UserDTO를 다시 조회합니다.
        HashMap<String, String> param = new HashMap<>();
        param.put("userId", loggedInUserId);
        UserDTO fullUser = userService.getUserInfo(param); // DB에서 최신 유저 정보 조회

        if (fullUser == null || fullUser.getUserNumber() == 0) { // userNumber가 Long 타입일 경우 null 체크
            log.error("로그인된 사용자 정보 (UserNumber)를 가져오지 못했습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve full user details or UserNumber not found.");
        }

        // 2. CollectionDTO에 userId (여기서는 userNumber) 설정
        // 백엔드에서 토큰을 통해 얻은 userNumber를 강제로 주입합니다.
        collection.setUserId(fullUser.getUserNumber()); // userService.getUserInfo()에서 가져온 userNumber 사용

        log.info("컬렉션 생성 - 사용자 ID (UserNumber): {}", collection.getUserId());
        log.info("컬렉션 이름: {}", collection.getName());

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
    public int updateCollection(@PathVariable Long id, @RequestBody CollectionDTO collection) {
        collection.setCollectionId(id);
        return collectionService.updateCollection(collection);
    }

    @DeleteMapping("/{id}")
    public int deleteCollection(@PathVariable Long id) {
        return collectionService.deleteCollection(id);
    }

    @GetMapping("/{id}")
    public CollectionDTO getCollection(@PathVariable Long id) {
        return collectionService.getCollection(id);
    }

    @GetMapping
    public List<CollectionDTO> getAllCollections() {
        return collectionService.getAllCollections();
    }
}