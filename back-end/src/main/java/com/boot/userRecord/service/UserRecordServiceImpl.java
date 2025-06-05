package com.boot.userRecord.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.userRecord.dao.UserRecordDAO;
import com.boot.userRecord.dto.UserRecordDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("UserRecordService")
public class UserRecordServiceImpl implements UserRecordService {
	@Autowired
    private UserRecordDAO userRecordDAO;
	
    @Override
    public UserRecordDTO findById(Long id) {
    	UserRecordDTO dto = userRecordDAO.findById(id);
    	if(dto == null) return null;
    	
    	List<Long> actionIds = parseIds(dto.getAction_ids());
        List<Long> bookIds = parseIds(dto.getBook_ids());
        List<Long> musicIds = parseIds(dto.getMusic_ids());
        
    	dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
    	dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
    	dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
    	
    	log.info("UserRecordServiceImpl : "+dto);
    	
    	return dto;
    }
    
    @Override
    public List<UserRecordDTO> getLatestRecords() {
        return userRecordDAO.findLatestRecords();
    }
    
    public List<Long> parseIds(String ids) {
    	return Arrays.stream(ids.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());
    } 	
}
