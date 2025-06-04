package com.boot.tensor.service;

import java.util.ArrayList;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.ActingDAO;
import com.boot.tensor.dto.ActingDTO;

@Service
public class ActingServiceImpl implements ActingService {
	@Autowired
	private SqlSession session;

	@Override
	public ArrayList<ActingDTO> getActingDTO() {
		ActingDAO dao = session.getMapper(ActingDAO.class);

		ArrayList<ActingDTO> resultList = dao.getActingDTO();

		return resultList;
	}

}
