package com.boot.tensor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.MusicDAO;
import com.boot.tensor.dto.MusicDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MusicServiceImpl implements MusicService {

	@Autowired
	private SqlSession session;

	@Override
	public ArrayList<MusicDTO> getMusicDTO() {
		MusicDAO dao = session.getMapper(MusicDAO.class);
		ArrayList<MusicDTO> resultList = dao.getMusicDTO();

		return resultList;
	}

	@Override
	public ArrayList<MusicDTO> getRandomMusic(int emotionNumber) {
		MusicDAO dao = session.getMapper(MusicDAO.class);
		int[] random_num_array = new int[3];

		Set<Integer> generated = new HashSet<>();

		for (int i = 0; i < random_num_array.length;) {
			int random_num = ((int) (Math.random() * 100) + (emotionNumber - 1) * 100 + 1);
			if (!generated.contains(random_num)) {
				generated.add(random_num);
				random_num_array[i] = random_num;
				i++; // i는 중복이 아닐 때만 증가
			}
		}

		int num_one = random_num_array[0];
		int num_two = random_num_array[1];
		int num_three = random_num_array[2];

		ArrayList<MusicDTO> dtos = dao.getRandomMusic(emotionNumber, num_one, num_two, num_three);

		return dtos;
	}

}
