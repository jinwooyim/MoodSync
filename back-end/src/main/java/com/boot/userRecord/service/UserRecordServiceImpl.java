package com.boot.userRecord.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.userRecord.dao.UserRecordDAO;
import com.boot.userRecord.dto.UserRecordDTO;

@Service("userMypageService")
public class UserRecordServiceImpl implements UserRecordService {
	@Autowired
    private UserRecordDAO userRecordDAO;

    @Override
    public UserRecordDTO findById(Long id) {
        return userRecordDAO.findById(id);
    }
    
    @Override
    public List<UserRecordDTO> getLatestRecords() {
        return userRecordDAO.findLatestRecords();
    }
}
