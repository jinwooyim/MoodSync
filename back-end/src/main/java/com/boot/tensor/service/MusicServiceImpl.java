package com.boot.tensor.service;

import java.util.ArrayList;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.MusicDAO;
import com.boot.tensor.dto.MusicDTO;

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

}
