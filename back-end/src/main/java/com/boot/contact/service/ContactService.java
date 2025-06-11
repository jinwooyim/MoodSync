package com.boot.contact.service;

import org.apache.ibatis.annotations.Param;

public interface ContactService {

	// 문의하기 내용 db에 저장
	public void insertContact(@Param("userNumber") int userNumber, @Param("contact_title") String contact_title,
			@Param("contact_content") String contact_content);
}
