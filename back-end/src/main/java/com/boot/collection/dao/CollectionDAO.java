package com.boot.collection.dao;

import java.util.List;

import com.boot.collection.dto.CollectionDTO;

public interface CollectionDAO {
    int insertCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(Long id);
    CollectionDTO selectCollection(Long id);
    List<CollectionDTO> selectAllCollections();
    List<CollectionDTO> findCollectionsByUserId(String userId);
}
