package com.boot.contact.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.contact.dto.ContactDTO;
import com.boot.z_page.criteria.CriteriaDTO;

public interface ContactDAO {

	// 문의하기 C
	public int createContact(@Param("userNumber") int userNumber, @Param("contact_title") String contactTitle,
			@Param("contact_content") String contactContent);

	// 문의하기 R (디테일)
	public int readContact(@Param("userNumber") int userNumber, @Param("contact_title") String contactTitle,
			@Param("contact_content") String contactContent);

	// 문의하기 U
	public int updateContact(@Param("userNumber") int userNumber, @Param("contact_title") String contactTitle,
			@Param("contact_content") String contactContent);

	// 문의하기 D
	public int deleteContact(@Param("userNumber") int userNumber, @Param("contact_title") String contactTitle,
			@Param("contact_content") String contactContent);

	// 문의하기 R(전체 / 페이징필요)
	public ArrayList<ContactDTO> allReadContact(CriteriaDTO criteriaDTO);

	// 전체 불러오기 (페이징용)
	public int getTotalCount(CriteriaDTO criteriaDTO);
}
