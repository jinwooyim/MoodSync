package com.boot.collection.service;

import java.util.List;

import com.boot.collection.dto.CollectionDTO;

public interface CollectionService {
    int createCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(Long id);
    CollectionDTO getCollection(Long id);
    List<CollectionDTO> getAllCollections();
    List<CollectionDTO> getCollectionsByUserId(String userNumber);
}
