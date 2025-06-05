package com.boot.userRecord.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.boot.userRecord.dto.UserRecordDTO;

@Mapper
public interface UserRecordDAO {
	UserRecordDTO findById(Long id); // id로 데이터 가져오기
	List<UserRecordDTO> findLatestRecords(); // 최신 데이터 7개
}
