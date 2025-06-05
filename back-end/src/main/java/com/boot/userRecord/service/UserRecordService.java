package com.boot.userRecord.service;

import java.util.List;

import com.boot.userRecord.dto.UserRecordDTO;

public interface UserRecordService {
	public UserRecordDTO findById(Long id);
	public List<UserRecordDTO> getLatestRecords();
}
