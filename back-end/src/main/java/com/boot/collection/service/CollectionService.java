package com.boot.collection.service;

import java.util.List;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;

public interface CollectionService {
    int createCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(int id);
    CollectionDTO getCollection(int id);
    List<CollectionDTO> getAllCollections();
    List<CollectionDTO> getCollectionsByUserId(int userNumber);
    
    //컬렉션에 아이템 추가하기 위해 컬렉션 리스트 가져옴
    public List<CollectionDTO> getCollectionsOnlyByUserId(int userId);
    
    public int insertCollectionItem(CollectionItemDTO collectionItem);
//    public CollectionDTO updateCollectionItem(CollectionItemDTO collectionItem);
    
    public int deleteCollectionItem(int collectionId);
    public void deleteBycollectionId(int collectionId);
    
}
