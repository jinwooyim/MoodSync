package com.boot.contact.dao;

import org.apache.ibatis.annotations.Param;

public interface ContactDAO {

	// 문의하기 내용 db에 저장
	public void insertContact(@Param("userNumber") int userNumber, @Param("contact_title") String contact_title,
			@Param("contact_content") String contact_content);

}
