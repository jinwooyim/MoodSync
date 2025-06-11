package com.boot.collection.dao;

import java.util.List;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;

public interface CollectionDAO {
	// 컬렉션
    int insertCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(int id);
    CollectionDTO selectCollection(int id);
    List<CollectionDTO> selectAllCollections();
    List<CollectionDTO> findCollectionsByUserId(int userId);
    
    // 아이템 넣는 부분
    List<CollectionItemDTO> findByCollectionId(int collectionId);
    int insertCollectionItem(CollectionItemDTO collectionItem);
//    void updateCollectionItem(CollectionItemDTO collectionItem);
    int deleteCollectionItem(Integer collectionItemId);
    void deleteByCollectionId(Long collectionId);
}
