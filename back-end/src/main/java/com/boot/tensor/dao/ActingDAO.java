package com.boot.tensor.dao;

import java.util.ArrayList;

import com.boot.tensor.dto.ActingDTO;

public interface ActingDAO {
	// 학습데이터 만들꺼임
	/*
	 * label = 감정 배열[6]해서 10000 01000 int[] listArr = new int[6];
	 * 
	 * feature = 특성(음악, 행동, 책) mapper 통해서 해당 감정 인덱스 번호로 리스트 뽑고 dto에서 actingNumber
	 * 랜덤으로 추출한 후 json 형태로 생성
	 * 
	 * feature length 만큼 label도 복제
	 * 
	 * 행복 json 형태 { label : [100000] # 행복 feature : [음악, 행동, 책] 리스트로 만들고 }
	 */
	public ArrayList<ActingDTO> getActingDTO();
}
