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

		ArrayList<MusicDTO> dtos = dao.getRandomMusic(emotionNumber);

		return dtos;
	}

}
