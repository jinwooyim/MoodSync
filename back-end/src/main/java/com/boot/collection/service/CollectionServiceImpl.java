package com.boot.collection.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.collection.dao.CollectionDAO;
import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;

import lombok.extern.slf4j.Slf4j;

@Service("CollectionService")
@Slf4j
public class CollectionServiceImpl implements CollectionService {
	@Autowired
	private SqlSession sqlSession;

    @Override
    public int createCollection(CollectionDTO collection) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.insertCollection(collection);
    }
    @Override
    public int updateCollection(CollectionDTO collection) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.updateCollection(collection);
    }
    @Override
    public int deleteCollection(int id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.deleteCollection(id);
    }
    @Override
    public CollectionDTO getCollection(int id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectCollection(id);
    }
    @Override
    public List<CollectionDTO> getAllCollections() {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectAllCollections();
    }
    
    
	@Override
	public List<CollectionDTO> getCollectionsByUserId(int userId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		
		List<CollectionDTO> collections=dao.findCollectionsByUserId(userId);
		for (CollectionDTO collection : collections) {
            List<CollectionItemDTO> items = dao.findByCollectionId(collection.getCollectionId());
            collection.setItems(items);
//            log.info("items"+items);
        }

        return collections;
	}
	
	@Override
	public int insertCollectionItem(CollectionItemDTO collectionItem) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		return dao.insertCollectionItem(collectionItem);
	}
	@Override
	public int deleteCollectionItem(int collectionId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		return dao.deleteCollectionItem(collectionId);
	}
	@Override
	public void deleteBycollectionId(int collectionId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		
	}
	@Override
	public List<CollectionDTO> getCollectionsOnlyByUserId(int userId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
//        log.info("컬렉션 목록만 조회 (userId: {})", userId);
        return dao.findCollectionsByUserId(userId);
	}
}
