package com.boot.tensor.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.tensor.dto.MusicDTO;

public interface MusicDAO {
	public ArrayList<MusicDTO> getMusicDTO();

	public ArrayList<MusicDTO> getRandomMusic(@Param("emotionNumber") int emotionNumber, @Param("num_one") int num_one,
			@Param("num_two") int num_two, @Param("num_three") int num_three);
}
