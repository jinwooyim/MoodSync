package com.boot.analize;

import org.apache.ibatis.session.SqlSession;

import com.boot.contact.dao.ContactDAO;

public class ContactAnalize {

	private SqlSession session;

	public int countContact() {
		ContactDAO dao = session.getMapper(ContactDAO.class);

		return 0;

	}

}
