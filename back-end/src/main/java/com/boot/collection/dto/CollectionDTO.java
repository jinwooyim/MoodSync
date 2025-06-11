package com.boot.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class CollectionDTO {
    private Long collectionId;
    private int userId;
    private String name;
    private String description;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}