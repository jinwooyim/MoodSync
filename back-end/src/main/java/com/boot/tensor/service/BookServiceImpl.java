package com.boot.tensor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.BookDAO;
import com.boot.tensor.dto.BookDTO;

@Service
public class BookServiceImpl implements BookService {

	@Autowired
	private SqlSession session;

	@Override
	public ArrayList<BookDTO> getBookDTO() {
		BookDAO dao = session.getMapper(BookDAO.class);
		ArrayList<BookDTO> resultList = dao.getBookDTO();

		return resultList;
	}

	@Override
	public ArrayList<BookDTO> getRandomBook(int emotionNumber) {
		BookDAO dao = session.getMapper(BookDAO.class);

		ArrayList<BookDTO> dtos = dao.getRandomBook(emotionNumber);

		return dtos;
	}

}
