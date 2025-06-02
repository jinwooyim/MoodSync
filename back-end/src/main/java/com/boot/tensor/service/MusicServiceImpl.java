package com.boot.tensor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.BookDAO;
import com.boot.tensor.dao.MusicDAO;
import com.boot.tensor.dto.BookDTO;
import com.boot.tensor.dto.MusicDTO;

@Service
public class MusicServiceImpl implements MusicService{

	
	@Autowired
	private SqlSession session;
	
	@Override
	public ArrayList getMusicDTO(int num) {
	    MusicDAO dao = session.getMapper(MusicDAO.class);
	    ArrayList<MusicDTO> resultList = new ArrayList<>();
	    Set<Integer> usedNumbers = new HashSet<>();
	    Random random = new Random();
	    
	    while (resultList.size() < 10 && usedNumbers.size() < num) {
	        int randomNum = random.nextInt(num) + 1;
	        
	        // 이미 사용한 번호가 아닌 경우에만 처리
	        if (!usedNumbers.contains(randomNum)) {
	            usedNumbers.add(randomNum);
	            MusicDTO dto = dao.getMusicDTO(randomNum);
	            
	            if (dto != null) {
	                resultList.add(dto);
	            }
	        }
	    }
	    
	    return resultList;
	}

}
