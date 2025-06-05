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

	@Override
	public ArrayList<ActingDTO> getRandomActing(int emotionNumber) {
		ActingDAO dao = session.getMapper(ActingDAO.class);
		int[] random_num_array = new int[3];

		for (int i = 0; i < random_num_array.length; i++) {
			int random_num = (int) ((Math.random() * 100) + (emotionNumber - 1) * 100);
			random_num_array[i] = random_num;
		}

		int num_one = random_num_array[0];
		int num_two = random_num_array[1];
		int num_three = random_num_array[2];

		ArrayList<ActingDTO> dtos = dao.getRandomActing(emotionNumber, num_one, num_two, num_three);

		return dtos;
	}

}
