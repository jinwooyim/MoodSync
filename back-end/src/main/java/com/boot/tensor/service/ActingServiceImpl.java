package com.boot.tensor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

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

	@Override
	public ArrayList<ActingDTO> getRandomActing(int emotionNumber, Object userEmotionData) {
		ActingDAO dao = session.getMapper(ActingDAO.class);

		ArrayList<ActingDTO> dtos = dao.getRandomActing(emotionNumber);

		return dtos;
	}

}
