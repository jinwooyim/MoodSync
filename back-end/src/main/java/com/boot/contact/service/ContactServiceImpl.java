package com.boot.contact.service;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.contact.dao.ContactDAO;

@Service("/ContactService")
public class ContactServiceImpl implements ContactService {

	@Autowired
	private SqlSession sqlsession;

	@Override
	public void insertContact(int userNumber, String contact_title, String contact_content) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		dao.insertContact(userNumber, contact_title, contact_content);
	}

}
