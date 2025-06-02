package com.boot.tensor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.ActingDAO;
import com.boot.tensor.dto.ActingDTO;
import com.boot.user.dao.UserDAO;

@Service
public class ActingServiceImpl implements ActingService{
	@Autowired
	private SqlSession session;
	
	@Override
	public ArrayList<ActingDTO> getActingDTO(int num) {
	    ActingDAO dao = session.getMapper(ActingDAO.class);
	    ArrayList<ActingDTO> resultList = new ArrayList<>();
	    Set<Integer> usedNumbers = new HashSet<>();
	    Random random = new Random();
	    
	    while (resultList.size() < 10 && usedNumbers.size() < num) {
	        int randomNum = random.nextInt(num) + 1;
	        
	        // 이미 사용한 번호가 아닌 경우에만 처리
	        if (!usedNumbers.contains(randomNum)) {
	            usedNumbers.add(randomNum);
	            ActingDTO dto = dao.getActingDTO(randomNum);
	            
	            if (dto != null) {
	                resultList.add(dto);
	            }
	        }
	    }
	    
	    return resultList;
	}

}
