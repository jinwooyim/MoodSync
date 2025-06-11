package com.boot.collection.controller;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.service.CollectionService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}