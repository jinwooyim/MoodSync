package com.boot.collection.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.collection.dao.CollectionDAO;
import com.boot.collection.dto.CollectionDTO;

@Service("CollectionService")
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
    public int deleteCollection(Long id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.deleteCollection(id);
    }
    @Override
    public CollectionDTO getCollection(Long id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectCollection(id);
    }
    @Override
    public List<CollectionDTO> getAllCollections() {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectAllCollections();
    }
	@Override
	public List<CollectionDTO> getCollectionsByUserId(String userId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		return dao.findCollectionsByUserId(userId);
	}
}
