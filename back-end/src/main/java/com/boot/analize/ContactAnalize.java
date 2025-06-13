package com.boot.analize;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.analize.dto.AnalizeContactDTO;
import com.boot.contact.dao.ContactDAO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ContactAnalize {

	@Autowired
	private SqlSession session;

	public List<AnalizeContactDTO> countContact(String created_date) {
		log.info("@#!@#$ countContact");
		log.info("@#!@#$ created_date =>" + created_date);

		ContactDAO dao = session.getMapper(ContactDAO.class);
		List<AnalizeContactDTO> dtos = dao.getTimeContactCount(created_date);

		log.info("@# dtos =>" + dtos);

		return dtos;
	}

}
